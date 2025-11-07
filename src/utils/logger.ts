import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { IPaginatedData } from '../models/dtos/paged';
import { ILogDTO } from '../models/dtos/log';
import { CommonUtils } from './common';

const logQueueIntervalMS = 500;

let dbDir = path.resolve(CommonUtils.getBasePath(), 'logs');

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'logs.db');

let db: sqlite3.Database;
let loggerInitialized = false;
let intervalHandle: NodeJS.Timeout;

// Define the log entry type
type LogEntry = {
	timestamp: string;
	level: 'INFO' | 'WARN' | 'ERROR';
	message: string;
	data: string | null;
};

const logQueue: LogEntry[] = [];
let isProcessing = false;

// Background task to drain the queue
const processLogQueue = () => {
	if (isProcessing || logQueue.length === 0 || !db) return;

	isProcessing = true;

	const next = logQueue.shift();
	if (next) {
		db.run(
			`INSERT INTO logs (timestamp, level, message, data) VALUES (?, ?, ?, ?)`,
			[next.timestamp, next.level, next.message, next.data],
			(err) => {
				if (err) console.error('Failed to write log:', err.message);
				isProcessing = false;
			}
		);
	} else {
		isProcessing = false;
	}
};

// Initializes the logger
export const initLogger = (): Promise<void> => {
	if (loggerInitialized) return Promise.resolve();

	return new Promise((resolve, reject) => {
		db = new sqlite3.Database(dbPath, (err) => {
			if (err) return reject('Failed to connect to SQLite DB: ' + err.message);

			db.run(
				`CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    level TEXT NOT NULL,
                    message TEXT NOT NULL,
                    data TEXT
                )`,
				(err) => {
					if (err) return reject('Failed to create logs table: ' + err.message);

					intervalHandle = setInterval(processLogQueue, logQueueIntervalMS);
					loggerInitialized = true;
					console.log('📝 Logger initialized at', dbPath);
					resolve();
				}
			);
		});
	});
};

// Gracefully shut down the logger and flush queue
export const shutdownLogger = (): Promise<void> => {
	return new Promise((resolve) => {
		if (intervalHandle) {
			clearInterval(intervalHandle);
		}

		const flush = () => {
			if (logQueue.length === 0) return resolve();
			processLogQueue();
			setTimeout(flush, logQueueIntervalMS);
		};

		flush();
	});
};

// Internal log writer
const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: Record<string, any> | null) => {
	if (!db) {
		console.warn('⚠️ Logger not initialized. Call initLogger() first.');
		return;
	}

	const timestamp = new Date().toISOString();
	logQueue.push({
		timestamp,
		level,
		message,
		data: data ? JSON.stringify(data) : null,
	});

	const prefix = `[${timestamp}] [${level}]`;
	if (level === 'ERROR') console.error(prefix, message);
	else if (level === 'WARN') console.warn(prefix, message);
	else console.log(prefix, message);
};

// Cleans logs older than [daysToKeep] days
export const cleanOldLogs = (daysToKeep: number = 90): Promise<number> => {
	return new Promise((resolve, reject) => {
		if (!db) return resolve(0);

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
		const isoCutoff = cutoffDate.toISOString();

		const query = `DELETE FROM logs WHERE timestamp < ?`;

		db.run(query, [isoCutoff], function (err) {
			if (err) {
				console.error('[LogCleanup] Failed to delete old logs:', err.message);
				return reject(err);
			} else {
				const deleted = this.changes;
				console.log(`[LogCleanup] Deleted ${deleted} logs older than ${isoCutoff}`);
				resolve(deleted);
			}
		});
	});
};


// Reads logs with pagination, sorting, and optional search
export const readLogs = (
	pageNo: number,
	pageSize: number,
	sort: { key: string; order: 'asc' | 'desc' },
	searchKey?: string
): Promise<IPaginatedData<ILogDTO>> => {
	return new Promise((resolve, reject) => {
		const offset = (pageNo - 1) * pageSize;
		const orderBy = `${sort.key} ${sort.order.toUpperCase()}`;
		const whereClause = searchKey
			? `WHERE LOWER(message) LIKE ? OR LOWER(level) LIKE ? OR LOWER(data) LIKE ?`
			: '';

		const searchParams = searchKey
			? [`%${searchKey.toLowerCase()}%`, `%${searchKey.toLowerCase()}%`, `%${searchKey.toLowerCase()}%`]
			: [];

		const countQuery = `SELECT COUNT(*) as count FROM logs ${whereClause}`;
		db.get(countQuery, searchParams, (err, countRow: any) => {
			if (err) return reject(err);

			const selectQuery = `
                SELECT id, timestamp, level, message, data
                FROM logs
                ${whereClause}
                ORDER BY ${orderBy}
                LIMIT ? OFFSET ?
            `;

			const queryParams = [...searchParams, pageSize, offset];

			db.all(selectQuery, queryParams, (err, rows: ILogDTO[]) => {
				if (err) return reject(err);

				resolve({
					total: countRow.count,
					items: rows,
					pageNo,
					pageSize,
				});
			});
		});
	});
};

// Main logger object
const Logger = {
	info: (msg: string, data?: Record<string, any>) => log('INFO', msg, data),
	warn: (msg: string, data?: Record<string, any>) => log('WARN', msg, data),
	error: (msg: string, data?: Record<string, any>) => log('ERROR', msg, data),
};

export default Logger;
