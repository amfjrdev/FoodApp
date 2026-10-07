import { AppError } from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/statusCodes.js';
import { sendError } from '../utils/apiResponse.js';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  if (env.NODE_ENV !== 'test') {
    console.error('🔥 Error Handler caught:', {
      name: err.name,
      message: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // 1. Custom Application Errors
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  // 2. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.reduce((acc, current) => {
      const field = current.path.join('.');
      acc[field] = current.message;
      return acc;
    }, {});
    return sendError(
      res,
      'Validation failed',
      HTTP_STATUS.BAD_REQUEST,
      'VALIDATION_ERROR',
      formattedErrors
    );
  }

  // 3. Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const formattedErrors = {};
    Object.keys(err.errors).forEach((key) => {
      formattedErrors[key] = err.errors[key].message;
    });
    return sendError(
      res,
      'Database validation failed',
      HTTP_STATUS.BAD_REQUEST,
      'VALIDATION_ERROR',
      formattedErrors
    );
  }

  // 4. Mongoose Cast Errors (Invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(
      res,
      `Invalid ${err.path}: ${err.value}`,
      HTTP_STATUS.BAD_REQUEST,
      'INVALID_ID'
    );
  }

  // 5. MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(
      res,
      `A resource with this ${field} already exists`,
      HTTP_STATUS.CONFLICT,
      'DUPLICATE_RESOURCE'
    );
  }

  // 6. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token', HTTP_STATUS.UNAUTHORIZED, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token expired', HTTP_STATUS.UNAUTHORIZED, 'TOKEN_EXPIRED');
  }

  // 7. Fallback for unhandled unexpected internal errors
  const isDev = env.NODE_ENV === 'development';
  return sendError(
    res,
    isDev ? err.message : 'An unexpected error occurred. Please try again later.',
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'INTERNAL_SERVER_ERROR',
    isDev ? { stack: err.stack } : null
  );
};
