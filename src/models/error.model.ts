import { BusinessErrorCodeMessages, BusinessErrorCodes } from '@utils';

export abstract class HttpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HttpError';
  }
  abstract get statusCode(): number;
  abstract get businessErrorCode(): string;
}

export class EmployeeEmptyError extends HttpError {
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

export class AuthorityLimitError extends HttpError {
  constructor() {
    super(BusinessErrorCodeMessages.S02);
  }

  get statusCode(): number {
    return 401;
  }

  get businessErrorCode(): string {
    return BusinessErrorCodes.S02;
  }
}

export class DynamoDBQueryKeyError extends HttpError {
  constructor() {
    super(BusinessErrorCodeMessages.S03);
  }

  get statusCode(): number {
    return 401;
  }

  get businessErrorCode(): string {
    return BusinessErrorCodes.S03;
  }
}

export class DeleteEmptyError extends HttpError {
  constructor() {
    super(BusinessErrorCodeMessages.S05);
  }

  get statusCode(): number {
    return 401;
  }

  get businessErrorCode(): string {
    return BusinessErrorCodes.S05;
  }
}

export class EmptyAttendanceError extends HttpError {
  constructor() {
    super(BusinessErrorCodeMessages.S06);
  }

  get statusCode(): number {
    return 401;
  }

  get businessErrorCode(): string {
    return BusinessErrorCodes.S06;
  }
}
