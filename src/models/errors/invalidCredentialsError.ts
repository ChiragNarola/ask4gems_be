import { BaseHttpError } from './baseHttpError';

export class InvalidCredentialsError extends BaseHttpError {
  public status: number;

  constructor(data?: any) {
    super('The credentials you entered are invalid. Please try again.', 401, data);
    this.status = 1; // Optional custom status
  }
}
