import { catchAsyncUnauth } from "../utils/catchAsyncUnauth";
import { AppSettings } from "../utils/config";
import { getDatabaseStats } from "../utils/dbStats";
import { sendSuccess } from "../utils/response";

export const StatsController = {
	getAppStatsHandler: catchAsyncUnauth<{}, any>(async (req, res) => {
		sendSuccess(res, {
			version: AppSettings.buildVersion,
			generatedAt: AppSettings.buildDate,
			environment: AppSettings.environment,
			allowedOrigins: AppSettings.allowedOrigins,
			apiTimeTrackingEnabled: AppSettings.apiTimeLoggingEnabled,
			operationTimeTrackingEnabled: AppSettings.operationTimeLoggingEnabled,
			tokenExpirationMinutes: AppSettings.authConfig.tokenExpirationMinutes,
			emailSentFrom: AppSettings.emailConfig.user,
		});
	}),

	getDBStatsHandler: catchAsyncUnauth<{}, any>(async (req, res) => {
		const stats = await getDatabaseStats();
		sendSuccess(res, stats);
	}),
}