import { AppError } from '@/types';

export class AppErrorHandler {
  static createError(
    type: AppError['type'],
    message: string,
    details?: string,
    recoverable: boolean = true
  ): AppError {
    return {
      type,
      message,
      details,
      recoverable,
      actions: [],
    };
  }

  static handleApiError(error: unknown): AppError {
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return this.createError(
          'NETWORK',
          'Server connection error',
          error.message,
          true
        );
      }

      // Check if it's a validation error
      if (error.message.includes('validation') || error.message.includes('required')) {
        return this.createError(
          'VALIDATION',
          'Data validation error',
          error.message,
          true
        );
      }

      // Check if it's an authorization error
      if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        return this.createError(
          'AUTHORIZATION',
          'Insufficient permissions to perform operation',
          error.message,
          false
        );
      }

      // Default to system error
      return this.createError(
        'SYSTEM',
        error.message,
        undefined,
        true
      );
    }

    return this.createError(
      'SYSTEM',
      'An unexpected error occurred',
      String(error),
      true
    );
  }

  static getErrorMessage(error: AppError): string {
    switch (error.type) {
      case 'NETWORK':
        return 'Check your internet connection and try again';
      case 'VALIDATION':
        return 'Check the entered data and correct errors';
      case 'AUTHORIZATION':
        return 'You do not have permission to perform this operation';
      case 'SYSTEM':
      default:
        return error.message || 'An unexpected error occurred';
    }
  }

  static isRetryable(error: AppError): boolean {
    return error.recoverable && (error.type === 'NETWORK' || error.type === 'SYSTEM');
  }

  static logError(error: AppError, context?: string): void {
    const logData = {
      type: error.type,
      message: error.message,
      details: error.details,
      context,
      timestamp: new Date().toISOString(),
    };

    // In development, log to console
    if (import.meta.env.DEV) {
      console.error('Application Error:', logData);
    }

    // In production, you would send this to your logging service
    // Example: sendToLoggingService(logData);
  }
}

// Hook for error handling in components
export const useErrorHandler = () => {
  const handleError = (error: unknown, context?: string): AppError => {
    const appError = AppErrorHandler.handleApiError(error);
    AppErrorHandler.logError(appError, context);
    return appError;
  };

  const getErrorMessage = (error: AppError): string => {
    return AppErrorHandler.getErrorMessage(error);
  };

  const isRetryable = (error: AppError): boolean => {
    return AppErrorHandler.isRetryable(error);
  };

  return {
    handleError,
    getErrorMessage,
    isRetryable,
  };
};