import { AppSettings } from './config';
import Logger from './logger';

export class OperationTimeLogger {
    private label: string;
    private intervals: { start: [number, number]; end?: [number, number] }[] = [];
    private isRunning = false;

    constructor(label: string) {
        this.label = label;
    }

    start() {
        if (!AppSettings.operationTimeLoggingEnabled) return;

        if (!this.isRunning) {
            this.intervals.push({ start: process.hrtime() });
            this.isRunning = true;
        }
    }

    pause() {
        if (this.isRunning) {
            const current = this.intervals[this.intervals.length - 1];
            current.end = process.hrtime();
            this.isRunning = false;
        }
    }

    resume() {
        this.start();
    }

    stopAndLog() {
        if (!AppSettings.operationTimeLoggingEnabled) return;

        if (this.isRunning) this.pause();
        const totalMs = this.intervals.reduce((sum, interval) => {
            if (!interval.end) return sum;
            const [s, ns] = [interval.end[0] - interval.start[0], interval.end[1] - interval.start[1]];
            return sum + s * 1000 + ns / 1e6;
        }, 0);

        Logger.info(`[OperationTimeLogger] ${this.label}`, {
            totalMs: totalMs.toFixed(2),
            intervals: this.intervals.map(({ start, end }, i) => ({
                index: i + 1,
                durationMs: end
                    ? ((end[0] - start[0]) * 1000 + (end[1] - start[1]) / 1e6).toFixed(2)
                    : 'still running',
            })),
        });
    }

    /**
     * Runs any function (sync or async), automatically tracking duration.
     */
    async track<T>(fn: () => T | Promise<T>): Promise<T> {
        try {
            this.start();
            const result = await fn();
            this.pause();
            return result;
        } catch (error) {
            this.pause();
            throw error;
        } finally {
            this.stopAndLog();
        }
    }
}



/* Usage

const timer = new ExecutionTimer('Whole block');

await timer.track(async () => {
  // Line 1–6 (tracked)
  await someHeavyTask();

  timer.pause(); // skip a part
  logSomething(); // not tracked
  timer.resume();

  await anotherTask(); // tracked again

  if (Math.random() > 0.5) throw new Error('simulate failure');
});

*/