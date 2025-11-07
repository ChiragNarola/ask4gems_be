import jwt, { SignOptions } from 'jsonwebtoken';
import { IGeneratedToken, ITokenPayload } from '../models/tokenPayload';
import { AppSettings } from './config';

export const generateLoginToken = (payload: ITokenPayload): IGeneratedToken => {
	const expiresInMinutes = AppSettings.authConfig.tokenExpirationMinutes;

	const options: SignOptions = {
		expiresIn: `${expiresInMinutes}m`,
		audience: AppSettings.authConfig.audience,
		issuer: AppSettings.authConfig.issuer
	};
	const token = jwt.sign(payload, AppSettings.authConfig.secret, options);
	const validTo = new Date(Date.now() + expiresInMinutes * 60 * 1000);
	return { token, validTo };
};

export const verifyLoginToken = (token: string): ITokenPayload => {
	return jwt.verify(token, AppSettings.authConfig.secret) as ITokenPayload;
};

export const generateForgotPasswordToken = (userId: string, email: string): string => {
	const options: SignOptions = { expiresIn: `10m` };
	return jwt.sign({ userId, email }, AppSettings.authConfig.secret, options);
};

export const verifyResetPasswordToken = (token: string): { userId: string, email: string } => {
	return jwt.verify(token, AppSettings.authConfig.secret) as { userId: string, email: string };
};
