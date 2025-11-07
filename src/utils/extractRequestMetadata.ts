import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AppSettings } from '../utils/config';
import { ITokenPayload } from '../models/tokenPayload';
import { AuthenticatedRequest } from '../middlewares/authorize';
import { CommonUtils } from './common';

interface IRequestMetadata {
	url: string;
	method: string;
	data: {
		json?: any;
		queryParams?: Record<string, any>;
		files?: { name: string; size: string; mime?: string }[];
	};
	user?: ITokenPayload & { exp?: string };
	userAgent?: string;
	headers: { key: string; value: string | string[] | undefined }[];
}

const SENSITIVE_KEYS = new Set([
	"password",
	"newPassword",
	"oldPassword",
	"token",
	"authorization",
	"tok"
]);

const redactSensitiveData = (obj: any): any => {
	if (Array.isArray(obj)) {
		return obj.map(redactSensitiveData);
	}

	if (obj && typeof obj === 'object') {
		const sanitized: any = {};
		for (const [key, value] of Object.entries(obj)) {
			if (SENSITIVE_KEYS.has(key)) {
				sanitized[key] = '************';
			} else {
				sanitized[key] = redactSensitiveData(value);
			}
		}
		return sanitized;
	}

	return obj;
};

const extractHeaders = (req: AuthenticatedRequest | Request) => Object.entries(req.headers).map(([key, value]) => ({ key, value }));

const extractData = (req: AuthenticatedRequest | Request) => {
	let qp = undefined;
	let json = undefined;
	let files = undefined;
	if (req.query)
		qp = redactSensitiveData(req.query);

	if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0)
		json = redactSensitiveData(req.body);

	if (req.files) {
		if (Array.isArray(req.files)) {
			files = req.files.map(file => ({
				name: file.originalname || file.filename,
				size: CommonUtils.prettyFileSize(file.size),
				mime: file.mimetype
			}));
		}
		else {
			const allFiles: any[] = [];
			Object.values(req.files).forEach((val: any) => {
				if (Array.isArray(val)) {
					val.forEach(file =>
						allFiles.push({
							name: file.originalname || file.filename,
							size: CommonUtils.prettyFileSize(file.size),
							mime: file.mimetype,
						})
					);
				}
			});
			files = allFiles;
		}
	}

	return {
		json,
		queryParams: qp,
		files,
	};
};

const extractUser = (req: AuthenticatedRequest | Request) => {
	const authHeader = req.headers['authorization'];
	if (authHeader?.startsWith('Bearer ')) {
		const token = authHeader.split(' ')[1];
		try {
			const decoded = jwt.verify(token, AppSettings.authConfig.secret) as ITokenPayload & { exp?: number };
			return {
				userId: decoded.userId,
				email: decoded.email,
				role: decoded.role,
				stamp: decoded.stamp,
				exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : undefined,
			};
		} catch (e) {
			// Invalid token - skip user info
		}
	}

	return undefined;
};

export const extractRequestMetadata = (req: AuthenticatedRequest | Request): IRequestMetadata => {
	return {
		url: req.originalUrl,
		method: req.method,
		data: extractData(req),
		headers: extractHeaders(req),
		userAgent: req.headers['user-agent'],
		user: extractUser(req),
	};
}
