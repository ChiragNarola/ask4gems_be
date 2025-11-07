import { ILogDTO } from "../models/dtos/log";
import { IPaginatedData } from "../models/dtos/paged";
import { IListRM } from "../models/rms/list";
import { LogsReaderService } from "../services/logsReader.service";
import { catchAsyncUnauth } from "../utils/catchAsyncUnauth";
import { sendSuccess } from "../utils/response";

export const LogController = {
	listHandler: catchAsyncUnauth<{}, IPaginatedData<ILogDTO>, IListRM>(async (req, res) => {
		const model = req.body as IListRM;
		const paginatedLogs = await LogsReaderService.list(model);
		sendSuccess(res, paginatedLogs);
	}),

}