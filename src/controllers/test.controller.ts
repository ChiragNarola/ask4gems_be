import { sendSuccess } from '../utils/response';
import { BadRequestError } from '../models/errors/badRequestError';
import { catchAsyncUnauth } from '../utils/catchAsyncUnauth';
import { queueEmail } from '../utils/email';
import Logger from '../utils/logger';

export const TestController = {
	sendEmailHandler: catchAsyncUnauth<{}, undefined, undefined, { email?: string | null }>(async (req, res) => {
		const email = req.query.email ?? "";
		BadRequestError.throwIfNullUndefinedOrEmptySpace(email, 'Email is required');
		queueEmail({ to: email, subject: 'VVS - Test', body: 'This is a test email.' });
		sendSuccess(res);
	}),

	logHandler: catchAsyncUnauth<{}, undefined, undefined, { message?: string | null }>(async (req, res) => {
		const message = req.query.message ?? "This is test message";
		Logger.info(message);
		sendSuccess(res);
	}),
};