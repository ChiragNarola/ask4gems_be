import { BaseHttpError } from './baseHttpError';

export class ForbiddenAccessError extends BaseHttpError {
  constructor(message: string = 'You are not authorized to access the requested resource.', data?: any) {
    super(message, 403, data);
  }
}
