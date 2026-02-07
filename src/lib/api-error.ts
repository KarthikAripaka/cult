// API Error Handler Utility

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export type ErrorResponse = {
  error: string;
  code: string;
};

// Helper to create specific errors
export const createError = {
  badRequest: (message: string = 'Bad Request') => 
    new APIError(message, 400, 'BAD_REQUEST'),
  
  unauthorized: (message: string = 'Unauthorized') => 
    new APIError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') => 
    new APIError(message, 403, 'FORBIDDEN'),
  
  notFound: (message: string = 'Resource not found') => 
    new APIError(message, 404, 'NOT_FOUND'),
  
  conflict: (message: string = 'Conflict') => 
    new APIError(message, 409, 'CONFLICT'),
  
  internal: (message: string = 'Internal server error') => 
    new APIError(message, 500, 'INTERNAL_ERROR'),
};

// Handle API errors for response
export const handleAPIError = (error: unknown): ErrorResponse => {
  if (error instanceof APIError) {
    return { error: error.message, code: error.code };
  }
  
  // Log unknown errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Unknown API Error:', error);
  }
  
  return { error: 'An unexpected error occurred', code: 'UNKNOWN_ERROR' };
};

// Format Supabase error
export const handleSupabaseError = (error: unknown): ErrorResponse => {
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string };
    
    // Handle common Supabase errors
    if (supabaseError.code === '23505') {
      return { error: 'Resource already exists', code: 'CONFLICT' };
    }
    if (supabaseError.code === '23503') {
      return { error: 'Referenced resource not found', code: 'NOT_FOUND' };
    }
    if (supabaseError.code === '22P02') {
      return { error: 'Invalid input format', code: 'BAD_REQUEST' };
    }
    
    return { error: supabaseError.message, code: 'SUPABASE_ERROR' };
  }
  
  return handleAPIError(error);
};
