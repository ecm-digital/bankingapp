/**
 * Utility for managing loading states across the application
 */

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
  message?: string;
}

export interface LoadingManager {
  start: (operation?: string, message?: string) => void;
  updateProgress: (progress: number, message?: string) => void;
  finish: () => void;
  error: (error: string) => void;
}

/**
 * Creates a loading manager for tracking async operations
 */
export const createLoadingManager = (
  setState: (state: Partial<LoadingState>) => void
): LoadingManager => {
  return {
    start: (operation?: string, message?: string) => {
      setState({
        isLoading: true,
        operation,
        message,
        progress: 0,
      });
    },

    updateProgress: (progress: number, message?: string) => {
      setState({
        progress: Math.max(0, Math.min(100, progress)),
        message,
      });
    },

    finish: () => {
      setState({
        isLoading: false,
        operation: undefined,
        progress: undefined,
        message: undefined,
      });
    },

    error: (error: string) => {
      setState({
        isLoading: false,
        operation: undefined,
        progress: undefined,
        message: error,
      });
    },
  };
};

/**
 * Wraps an async function with loading state management
 */
export const withLoadingState = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  loadingManager: LoadingManager,
  operation?: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      loadingManager.start(operation);
      const result = await fn(...args);
      loadingManager.finish();
      return result;
    } catch (error) {
      loadingManager.error(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };
};

/**
 * Debounces a function to prevent excessive calls
 */
export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttles a function to limit call frequency
 */
export const throttle = <T extends any[]>(
  fn: (...args: T) => void,
  limit: number
) => {
  let inThrottle: boolean;
  
  return (...args: T) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Creates a cache for expensive operations
 */
export const createCache = <K, V>(maxSize: number = 100) => {
  const cache = new Map<K, { value: V; timestamp: number }>();
  
  return {
    get: (key: K, maxAge: number = 5 * 60 * 1000): V | undefined => {
      const entry = cache.get(key);
      if (!entry) return undefined;
      
      if (Date.now() - entry.timestamp > maxAge) {
        cache.delete(key);
        return undefined;
      }
      
      return entry.value;
    },
    
    set: (key: K, value: V): void => {
      // Remove oldest entries if cache is full
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      
      cache.set(key, { value, timestamp: Date.now() });
    },
    
    clear: (): void => {
      cache.clear();
    },
    
    size: (): number => {
      return cache.size;
    },
  };
};

/**
 * Optimistic update helper for better UX
 */
export const createOptimisticUpdate = <T>(
  currentData: T,
  updateFn: (data: T) => T,
  revertFn?: (data: T) => T
) => {
  const optimisticData = updateFn(currentData);
  
  return {
    optimisticData,
    revert: revertFn ? () => revertFn(optimisticData) : () => currentData,
  };
};

/**
 * Batch multiple async operations for better performance
 */
export const batchOperations = async <T>(
  operations: (() => Promise<T>)[],
  batchSize: number = 3,
  delay: number = 100
): Promise<T[]> => {
  const results: T[] = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(op => op()));
    results.push(...batchResults);
    
    // Add delay between batches to prevent overwhelming the system
    if (i + batchSize < operations.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
};

/**
 * Creates a queue for sequential operation processing
 */
export const createOperationQueue = () => {
  const queue: (() => Promise<any>)[] = [];
  let isProcessing = false;
  
  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    
    isProcessing = true;
    
    while (queue.length > 0) {
      const operation = queue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Queue operation failed:', error);
        }
      }
    }
    
    isProcessing = false;
  };
  
  return {
    add: (operation: () => Promise<any>) => {
      queue.push(operation);
      processQueue();
    },
    
    clear: () => {
      queue.length = 0;
    },
    
    size: () => queue.length,
    
    isProcessing: () => isProcessing,
  };
};