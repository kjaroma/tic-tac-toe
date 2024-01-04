export type ApplicationErrors = ApiError | GameError | Error;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class GameError extends Error {
  constructor(
    message: string,
    public readonly gameId: string,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
