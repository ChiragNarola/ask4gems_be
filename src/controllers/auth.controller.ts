import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as AuthService from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  return sendSuccess(res, result);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = String(req.query.token || req.body.token || '');
  const result = await AuthService.verifyEmail(token);
  return sendSuccess(res, result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  console.log('Logging in user:', email);
  console.log('Password:', password);
  const result = await AuthService.login(email, password);
  return sendSuccess(res, result);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const result = await AuthService.forgotPassword(email);
  return sendSuccess(res, result);
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as { token: string; newPassword: string };
  const result = await AuthService.resetPassword(token, newPassword);
  return sendSuccess(res, result);
});


