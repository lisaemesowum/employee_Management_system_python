export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

export const successResponse = <T>(
  message: string,
  data: T,
): ApiSuccessResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (
  message: string,
  code: string,
  details?: unknown,
): ApiErrorResponse => {
  return {
    success: false,
    message,
    code,
    ...(details !== undefined ? { details } : {}),
  };
};