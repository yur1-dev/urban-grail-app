// Export all types from individual type files for convenient importing
export * from './api';
export * from './auth';
export * from './product';
export * from './order';

// Common utility types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
