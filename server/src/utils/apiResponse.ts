import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export class ApiResponseHandler {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201);
  }

  static error(
    res: Response,
    message: string,
    errorCode: string = 'ERROR',
    statusCode: number = 400,
    errors?: Record<string, string>
  ): Response {
    const payload: ApiResponse = {
      success: false,
      message,
      error: errorCode,
      ...(errors ? { errors } : {})
    };
    return res.status(statusCode).json(payload);
  }
}
