import { Request, Response, NextFunction } from 'express';
import { AppSettings } from '../utils/config';
import Logger from '../utils/logger';
import { extractRequestMetadata } from '../utils/extractRequestMetadata';

const IGNORED_PATH_PREFIXES: string[] = ["/api/stats", "/api/logs"];

export function logAPITime(req: Request, res: Response, next: NextFunction): void {
	if (
		!AppSettings.apiTimeLoggingEnabled ||
		!req.originalUrl.startsWith("/api/") ||
		req.method === 'OPTIONS' ||
		IGNORED_PATH_PREFIXES.some(prefix => req.originalUrl.startsWith(prefix))
	) {
		return next();
	}

	const start = process.hrtime();

	res.on('finish', () => {
		const [seconds, nanoseconds] = process.hrtime(start);
		const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
		const reqMetadata = extractRequestMetadata(req);

		if (res.statusCode >= 500) {
			Logger.error(
				`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${durationMs}ms`,
				{ durationMs: durationMs, requestMetadata: reqMetadata }
			);
		}
		else if (res.statusCode >= 400) {
			Logger.warn(
				`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${durationMs}ms`,
				{ durationMs: durationMs, requestMetadata: reqMetadata }
			);
		}
		else {
			Logger.info(
				`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${durationMs}ms`,
				{ durationMs: durationMs, requestMetadata: reqMetadata }
			);
		}
	});

	next();
}
