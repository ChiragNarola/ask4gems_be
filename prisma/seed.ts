import { seedInitialData } from '../src/utils/seed';
import { prisma } from '../src/utils/prisma';
import Logger, { initLogger, shutdownLogger } from '../src/utils/logger';

async function main() {
	await initLogger(); // Initialize logger before using it

	Logger.info('Running Prisma Seeder...');

	try {
		await seedInitialData();
		Logger.info('Database seeded successfully!');
	} catch (error) {
		Logger.error('Error during database seeding', {
			error: error instanceof Error ? error.message : String(error),
		});
		process.exit(1);
	} finally {
		await prisma.$disconnect();
		await shutdownLogger(); //Gracefully stop logger and flush logs
	}
}

main();
