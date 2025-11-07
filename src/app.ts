import express, { json, urlencoded } from 'express';
import path from 'path';
import { corsHandler } from './middlewares/cors';
import { globalErrorHandler } from './middlewares/errorHandler';
import { logAPITime } from './middlewares/trackActionTime';
import { staticAuth } from './middlewares/staticAuth';

import testRoutes from './routes/test.routes';
import logRoutes from './routes/log.routes';
import statsRoutes from './routes/stats.routes';
import authRoutes from './routes/auth.routes';
import requestsRoutes from './routes/requests.routes';
import mastersRoutes from './routes/masters.routes';
import { CommonUtils } from './utils/common';
import swaggerDocs from './utils/swagger';

export async function createApp() {
	const app = express();

	// Middleware
	app.use(logAPITime);
	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use(corsHandler);
	app.use(staticAuth());

	// Static files
	const publicFolder = path.join(CommonUtils.getBasePath(), 'assets', 'public');
	app.use('/', express.static(publicFolder));

	// API Routes
	app.use('/api/stats', statsRoutes);
	app.use('/api/logs', logRoutes);
	app.use('/api/test', testRoutes);
	app.use('/api/auth', authRoutes);
	app.use('/api/requests', requestsRoutes);
	app.use('/api/masters', mastersRoutes);


	// Middleware
	app.use(globalErrorHandler);

	// Swagger Docs
	swaggerDocs(app);

	return app;
}
