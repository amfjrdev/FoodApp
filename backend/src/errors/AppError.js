import { HTTP_STATUS } from '../constants/statusCodes.js';

export class AppError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code = 'INTERNAL_ERROR',
    isOperational = true,
    details = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, HTTP_STATUS.NOT_FOUND, code);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, code, true, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', code = 'UNAUTHORIZED') {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', code = 'FORBIDDEN') {
    super(message, HTTP_STATUS.FORBIDDEN, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', code = 'CONFLICT') {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}
