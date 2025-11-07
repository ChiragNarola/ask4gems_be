import { BaseHttpError } from './baseHttpError';

export class UnauthorizedError extends BaseHttpError {
  constructor(message: string = 'You are not authenticated to access the requested resource.', data?: any) {
    super(message, 401, data);
  }
}
