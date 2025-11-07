import { ILogDTO } from "../models/dtos/log";
import { IPaginatedData } from "../models/dtos/paged";
import { BadRequestError } from "../models/errors/badRequestError";
import { IListRM } from "../models/rms/list";
import { readLogs } from "../utils/logger";

export const LogsReaderService = {
	async list(model: IListRM): Promise<IPaginatedData<ILogDTO>> {
		BadRequestError.throwIfNullOrUndefined(model, 'Model is required');
		if (model.sort && !["timestamp", "level", "message"].includes(model.sort.key))
			throw new BadRequestError('Invalid sort key.');

		if (!model.sort)
			model.sort = { key: 'timestamp', order: 'desc' };

		return await readLogs(model.pageNo, model.pageSize, model.sort, model.searchKey);
	},
}
