export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

