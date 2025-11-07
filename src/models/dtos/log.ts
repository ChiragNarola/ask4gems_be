export interface ILogDTO {
	id: number;
	timestamp: string;
	level: 'INFO' | 'WARN' | 'ERROR';
	message: string;
	data: string | null;
}

export interface IJobLogDTO {
	id: string;
	jobRunId: string;
	jobName: string;
	isMissed: boolean;
	status: string;
	startTime: Date;
	endTime: Date;
	durationSec: number;
	error?: string | null;
	dateCreate: Date;

	statusTrack: {
		status: string;
		timestamp: Date;
		message?: string | null;
	}[];

	detailLogs: {
		timestamp: Date;
		level: string;
		message: string;
		meta?: any;
	}[];
}


export interface IJobStatusTrackerDTO {
	jobName: string;
	jobRunId: string;
	status: string;
	timestamp: Date;
	message?: string | null;
}