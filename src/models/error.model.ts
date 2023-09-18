import { BusinessErrorCodeMessages, BusinessErrorCodes } from '@utils';

export abstract class HttpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HttpError';
  }
  abstract get statusCode(): number;
  abstract get businessErrorCode(): string;
}

export class EmployeeDeletedError extends HttpError {
  constructor() {
    super(BusinessErrorCodeMessages.S01);
  }

  get statusCode(): number {
    return 400;
  }

  get businessErrorCode(): string {
    return BusinessErrorCodes.S01;
  }
}
