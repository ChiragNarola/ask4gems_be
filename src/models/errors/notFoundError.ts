import { BaseHttpError } from './baseHttpError';

export class NotFoundError extends BaseHttpError {
  constructor(message: string, data?: any) {
    super(message, 404, data);
  }
}
