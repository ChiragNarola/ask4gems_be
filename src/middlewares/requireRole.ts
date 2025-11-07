import { AuthenticatedRequest } from './authorize';
import { ForbiddenAccessError } from '../models/errors/forbiddenAccessError';
import { UserRoleType } from '../models/types';
import { RequestHandler } from 'express';

export function requireRole(...roles: UserRoleType[]): RequestHandler {
    return ((req, res, next) => {
        const user = (req as AuthenticatedRequest).user;

        if (!user || !roles.includes(user.role)) {
            throw new ForbiddenAccessError("You are not authorized to access the requested resource. Reason: Insufficient role");
        }

        next();
    }) as RequestHandler;
}