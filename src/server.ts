import { createApp } from './app';
import Logger, { initLogger, shutdownLogger } from './utils/logger';
import { AppSettings } from './utils/config';
import { SystemInfo } from './utils/systemInfo';
import { disconnectPrisma } from './utils/prisma';
import { shutdownEmailQueue } from './utils/email';

async function startServer() {
	await initLogger();
	const app = await createApp();

	if (require.main === module) {
		const PORT = process.env.PORT || AppSettings.port || 3000;
		app.listen(PORT, () => {
			Logger.info(`🚀 Server running for "${AppSettings.environment}" on port ${PORT}`, {
				system: SystemInfo(),
			});
		});
	} else {
		Logger.info(`🚀 App initialized via IIS/iisnode – not binding manually`, {
			system: SystemInfo(),
		});
	}
}

async function exitServer(code: number) {
	await shutdownLogger();
	await shutdownEmailQueue();
	await disconnectPrisma();
	process.exit(code);
}

// Graceful shutdown
process.on('SIGINT', async () => {
	console.log('🛑 Received SIGINT, shutting down gracefully...');
	await exitServer(0);
});
process.on('SIGTERM', async () => {
	console.log('🛑 Received SIGTERM, shutting down gracefully...');
	await exitServer(0);
});
process.on('unhandledRejection', async (reason) => {
	console.error('🛑 Unhandled Rejection:', reason);
	Logger.error('Unhandled Rejection', { reason });
	await exitServer(1);
});
process.on('uncaughtException', async (err) => {
	console.error('🛑 Uncaught Exception:', err);
	Logger.error('Uncaught Exception', { error: err });
	await exitServer(1);
});

startServer();