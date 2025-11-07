import { BaseHttpError } from './baseHttpError';

export class CustomError extends BaseHttpError {
  constructor(message: string, statusCode = 500, data?: any) {
    super(message, statusCode, data);
  }
}
