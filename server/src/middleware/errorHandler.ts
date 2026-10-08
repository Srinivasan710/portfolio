import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  return ApiResponseHandler.error(
    res,
    `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    'ROUTE_NOT_FOUND',
    404
  );
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Custom ApiError
  if (err instanceof ApiError) {
    return ApiResponseHandler.error(
      res,
      err.message,
      err.errorCode,
      err.statusCode,
      err.errors
    );
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    for (const key in err.errors) {
      errors[key] = err.errors[key].message;
    }
    return ApiResponseHandler.error(
      res,
      'Validation error',
      'VALIDATION_ERROR',
      400,
      errors
    );
  }

  // Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    return ApiResponseHandler.error(
      res,
      `Invalid resource identifier: ${err.value}`,
      'INVALID_ID',
      400
    );
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponseHandler.error(
      res,
      `Duplicate value entered for ${field}`,
      'DUPLICATE_KEY_ERROR',
      409
    );
  }

  // SyntaxError (e.g. malformed JSON in request body)
  if (err instanceof SyntaxError && 'body' in err) {
    return ApiResponseHandler.error(
      res,
      'Malformed JSON request body',
      'INVALID_JSON',
      400
    );
  }

  console.error('Unhandled Error:', err);
  return ApiResponseHandler.error(
    res,
    err.message || 'Internal Server Error',
    'INTERNAL_SERVER_ERROR',
    500
  );
};
