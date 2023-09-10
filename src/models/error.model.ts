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
    super('ユーザは削除されてました。管理者にご連絡ください。');
  }

  get statusCode(): number {
    return 400;
  }

  get businessErrorCode(): string {
    return 'S01';
  }
}
