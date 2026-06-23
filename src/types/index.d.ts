export type ApiResponse<T> = {
  data: T;
};

export type ApiResponseError = {
  message: string;
  code?: string;
  reason?: string;
  details?: unknown;
};

export type PaginationResult = {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
