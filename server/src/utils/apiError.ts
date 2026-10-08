export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public errors?: Record<string, string>;

  constructor(statusCode: number, message: string, errorCode: string = 'ERROR', errors?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errorCode: string = 'BAD_REQUEST', errors?: Record<string, string>) {
    return new ApiError(400, message, errorCode, errors);
  }

  static notFound(message: string, errorCode: string = 'NOT_FOUND') {
    return new ApiError(404, message, errorCode);
  }

  static internal(message: string = 'Internal Server Error', errorCode: string = 'INTERNAL_SERVER_ERROR') {
    return new ApiError(500, message, errorCode);
  }
}
