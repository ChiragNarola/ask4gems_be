import { prisma } from './prisma';

type TableStat = {
	name: string;
	actualRowCount: number;
	size: string;
};

export async function getDatabaseStats() {
	const dbSizeResult = await prisma.$queryRawUnsafe<{ size: string }[]>(
		`SELECT pg_size_pretty(pg_database_size(current_database())) AS size`
	);

	const tableNamesResult = await prisma.$queryRawUnsafe<{ name: string }[]>(
		`SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public'`
	);

	const tables: TableStat[] = [];

	for (const { name } of tableNamesResult) {
		const rowCountResult = await prisma.$queryRawUnsafe<{ count: string }[]>(
			`SELECT COUNT(*)::TEXT AS count FROM "public"."${name}"`
		);

		const sizeResult = await prisma.$queryRawUnsafe<{ size: string }[]>(
			`SELECT pg_size_pretty(pg_total_relation_size('public."${name}"')) AS size`
		);

		tables.push({
			name: `public.${name}`,
			actualRowCount: parseInt(rowCountResult[0].count, 10),
			size: sizeResult[0].size,
		});
	}

	const dbSize = dbSizeResult[0]?.size || 'Unknown';

	return {
		dbSize,
		tables,
	};
}
