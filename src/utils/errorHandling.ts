import { MockApiError } from '@/api/mockApi';

export interface AppError {
  type: 'VALIDATION' | 'NETWORK' | 'AUTHORIZATION' | 'SYSTEM' | 'BUSINESS';
  message: string;
  details?: string;
  code?: string;
  recoverable: boolean;
  actions?: ErrorAction[];
}

export interface ErrorAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

/**
 * Converts various error types to standardized AppError format
 */
export const normalizeError = (error: unknown): AppError => {
  if (error instanceof MockApiError) {
    return {
      type: getErrorTypeFromStatus(error.status),
      message: error.message,
      code: error.code,
      recoverable: isRecoverableError(error.status),
      actions: getErrorActions(error),
    };
  }
  
  if (error instanceof Error) {
    return {
      type: 'SYSTEM',
      message: error.message,
      recoverable: true,
      actions: [
        {
          label: 'Try Again',
          action: () => window.location.reload(),
          primary: true,
        },
      ],
    };
  }
  
  return {
    type: 'SYSTEM',
    message: 'An unexpected error occurred',
    recoverable: true,
    actions: [
      {
        label: 'Try Again',
        action: () => window.location.reload(),
        primary: true,
      },
    ],
  };
};

/**
 * Maps HTTP status codes to error types
 */
const getErrorTypeFromStatus = (status: number): AppError['type'] => {
  if (status >= 400 && status < 500) {
    if (status === 401 || status === 403) return 'AUTHORIZATION';
    if (status === 400 || status === 422) return 'VALIDATION';
    return 'BUSINESS';
  }
  
  if (status >= 500) return 'SYSTEM';
  
  return 'NETWORK';
};

/**
 * Determines if an error is recoverable based on status code
 */
const isRecoverableError = (status: number): boolean => {
  // Client errors (4xx) are generally not recoverable by retrying
  if (status >= 400 && status < 500) {
    return status === 408 || status === 429; // Timeout or rate limit
  }
  
  // Server errors (5xx) are generally recoverable
  return status >= 500;
};

/**
 * Generates appropriate actions for different error types
 */
const getErrorActions = (error: MockApiError): ErrorAction[] => {
  const actions: ErrorAction[] = [];
  
  switch (error.code) {
    case 'TIMEOUT':
    case 'SERVICE_UNAVAILABLE':
      actions.push({
        label: 'Retry',
        action: () => {}, // Will be overridden by caller
        primary: true,
      });
      break;
      
    case 'RATE_LIMITED':
      actions.push({
        label: 'Wait and Retry',
        action: () => {
          setTimeout(() => {}, 5000); // Will be overridden by caller
        },
        primary: true,
      });
      break;
      
    case 'INVALID_PASSWORD':
    case 'EMPLOYEE_NOT_FOUND':
      actions.push({
        label: 'Try Again',
        action: () => {}, // Will be overridden by caller
        primary: true,
      });
      break;
      
    case 'INSUFFICIENT_FUNDS':
      actions.push({
        label: 'Check Balance',
        action: () => {}, // Will be overridden by caller
        primary: true,
      });
      break;
      
    default:
      actions.push({
        label: 'Dismiss',
        action: () => {},
        primary: true,
      });
  }
  
  return actions;
};

/**
 * User-friendly error messages for common error codes
 */
export const getErrorMessage = (error: AppError): string => {
  const friendlyMessages: Record<string, string> = {
    'TIMEOUT': 'The request timed out. Please check your connection and try again.',
    'SERVICE_UNAVAILABLE': 'The service is temporarily unavailable. Please try again in a few moments.',
    'RATE_LIMITED': 'Too many requests. Please wait a moment before trying again.',
    'EMPLOYEE_NOT_FOUND': 'Employee account not found. Please check your email address.',
    'INVALID_PASSWORD': 'Incorrect password. Please try again.',
    'CUSTOMER_NOT_FOUND': 'Customer not found. Please verify the customer ID.',
    'INSUFFICIENT_FUNDS': 'Insufficient funds in the account for this transaction.',
    'AMOUNT_LIMIT_EXCEEDED': 'Transaction amount exceeds the daily limit.',
    'INVALID_EMAIL': 'Please enter a valid email address.',
    'CONTENT_TOO_LONG': 'Content is too long. Please shorten your message.',
    'QUERY_TOO_SHORT': 'Search query must be at least 2 characters long.',
  };
  
  return error.code && friendlyMessages[error.code] 
    ? friendlyMessages[error.code] 
    : error.message;
};

/**
 * Determines if an error should be shown to the user
 */
export const shouldShowError = (error: AppError): boolean => {
  // Don't show system errors that are being handled automatically
  if (error.type === 'SYSTEM' && !error.recoverable) {
    return false;
  }
  
  // Always show validation and business errors
  if (error.type === 'VALIDATION' || error.type === 'BUSINESS') {
    return true;
  }
  
  // Show authorization errors
  if (error.type === 'AUTHORIZATION') {
    return true;
  }
  
  // Show network errors that user can act on
  return error.recoverable;
};

/**
 * Logs errors for debugging purposes
 */
export const logError = (error: AppError, context?: string) => {
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      type: error.type,
      message: error.message,
      code: error.code,
      recoverable: error.recoverable,
    },
  };
  
  if (error.type === 'SYSTEM') {
    console.error('System Error:', logData);
  } else {
    console.warn('Application Error:', logData);
  }
};

/**
 * Creates a retry function with exponential backoff
 */
export const createRetryFunction = <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) => {
  return async (): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  };
};