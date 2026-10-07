import { HTTP_STATUS } from '../constants/statusCodes.js';

export const sendSuccess = (res, data = {}, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = (
  res,
  data = [],
  pagination = {},
  message = 'Success',
  statusCode = HTTP_STATUS.OK
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || data.length,
      totalPages: pagination.totalPages || Math.ceil((pagination.total || data.length) / (pagination.limit || 20)),
    },
  });
};

export const sendError = (
  res,
  message = 'Internal Server Error',
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code = 'INTERNAL_ERROR',
  errors = null
) => {
  const response = {
    success: false,
    message,
    code,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
