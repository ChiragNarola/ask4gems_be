// src/middleware/cors.middleware.ts
import cors, { CorsOptions } from 'cors';
import { AppSettings } from '../utils/config';
import { ForbiddenAccessError } from '../models/errors/forbiddenAccessError';

const corsOptions: CorsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin || AppSettings.allowedOrigins.includes(origin))
            callback(null, true);
        else
            callback(new ForbiddenAccessError('Domain not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

export const corsHandler = cors(corsOptions);
