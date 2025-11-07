import { Request, RequestHandler, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppSettings } from '../utils/config';
import { UnauthorizedError } from '../models/errors/unauthorizedError';
import { ITokenPayload } from '../models/tokenPayload';

export interface AuthenticatedRequest extends Request {
    user: ITokenPayload;
}

function authorizeImpl(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('You are not authenticated to access the requested resource. Reason: Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, AppSettings.authConfig.secret) as ITokenPayload;
        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch {
        throw new UnauthorizedError('You are not authenticated to access the requested resource. Reason: Invalid or expired token');
    }
}

export const authorize: RequestHandler = authorizeImpl;

