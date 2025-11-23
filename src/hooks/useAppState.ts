import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useCustomersStore } from '@/stores/customersStore';
import { useTransactionsStore } from '@/stores/transactionsStore';
import { useQueueStore } from '@/stores/queueStore';
import { useProductsStore } from '@/stores/productsStore';
import { 
  seedDemoData, 
  setupDemoScenario, 
  validateDataIntegrity,
  preloadCustomerData 
} from '@/utils/dataSeed';
import { normalizeError, logError } from '@/utils/errorHandling';
import { createCache } from '@/utils/loadingStates';

// Create a cache for frequently accessed data
const appCache = createCache<string, any>(50);

/**
 * Comprehensive hook for managing application state and operations
 */
export const useAppState = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Store states
  const auth = useAuthStore();
  const customers = useCustomersStore();
  const transactions = useTransactionsStore();
  const queue = useQueueStore();
  const products = useProductsStore();

  // Computed states
  const isAnyLoading = auth.isLoading || customers.isLoading || 
                      transactions.isLoading || queue.isLoading || products.isLoading;

  const hasAnyError = auth.error || customers.error || 
                     transactions.error || queue.error || products.error;

  /**
   * Initialize the application with demo data
   */
  const initializeApp = useCallback(async () => {
    if (isInitialized) return;

    setGlobalLoading(true);
    setInitializationError(null);

    try {
      console.log('🚀 Initializing application...');
      
      const result = await seedDemoData();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to seed demo data');
      }

      // Validate data integrity
      const validation = validateDataIntegrity();
      if (!validation.valid) {
        console.warn('⚠️ Data integrity issues:', validation.issues);
      }

      setIsInitialized(true);
      console.log('✅ Application initialized successfully');
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'App Initialization');
      setInitializationError(normalizedError.message);
      console.error('❌ Application initialization failed:', error);
    } finally {
      setGlobalLoading(false);
    }
  }, [isInitialized]);

  /**
   * Setup a specific demo scenario
   */
  const setupScenario = useCallback(async (
    scenario: 'customer-service' | 'busy-queue' | 'vip-client' | 'transaction-heavy' | 'error-testing'
  ) => {
    setGlobalLoading(true);
    
    try {
      await setupDemoScenario(scenario);
      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Scenario Setup');
      return { success: false, error: normalizedError.message };
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  /**
   * Preload customer data with caching
   */
  const loadCustomerData = useCallback(async (customerId: string) => {
    const cacheKey = `customer_${customerId}`;
    const cached = appCache.get(cacheKey);
    
    if (cached) {
      console.log(`📋 Using cached data for customer ${customerId}`);
      return cached;
    }

    setGlobalLoading(true);
    
    try {
      const result = await preloadCustomerData(customerId);
      
      if (result.success) {
        appCache.set(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Customer Data Loading');
      return { success: false, error: normalizedError.message };
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  /**
   * Clear all errors across stores
   */
  const clearAllErrors = useCallback(() => {
    auth.clearError();
    customers.clearError();
    transactions.clearError();
    queue.clearError();
    products.clearError();
    setInitializationError(null);
  }, [auth, customers, transactions, queue, products]);

  /**
   * Refresh all data
   */
  const refreshAllData = useCallback(async () => {
    setGlobalLoading(true);
    
    try {
      await Promise.all([
        customers.fetchCustomers(),
        transactions.fetchTransactions(),
        queue.fetchQueue(),
        products.fetchProducts(),
      ]);
      
      // Clear cache to force fresh data
      appCache.clear();
      
      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Data Refresh');
      return { success: false, error: normalizedError.message };
    } finally {
      setGlobalLoading(false);
    }
  }, [customers, transactions, queue, products]);

  /**
   * Get application health status
   */
  const getHealthStatus = useCallback(() => {
    const status = {
      initialized: isInitialized,
      authenticated: auth.isAuthenticated,
      dataLoaded: {
        customers: customers.customers.length > 0,
        transactions: transactions.transactions.length > 0,
        queue: queue.queueItems.length > 0,
        products: products.products.length > 0,
      },
      errors: {
        auth: auth.error,
        customers: customers.error,
        transactions: transactions.error,
        queue: queue.error,
        products: products.error,
        initialization: initializationError,
      },
      loading: {
        global: globalLoading,
        auth: auth.isLoading,
        customers: customers.isLoading,
        transactions: transactions.isLoading,
        queue: queue.isLoading,
        products: products.isLoading,
      },
    };

    const isHealthy = status.initialized && 
                     status.authenticated && 
                     Object.values(status.dataLoaded).every(Boolean) &&
                     !Object.values(status.errors).some(Boolean);

    return { ...status, isHealthy };
  }, [
    isInitialized, auth, customers, transactions, queue, products, 
    initializationError, globalLoading
  ]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!isInitialized && !globalLoading) {
      initializeApp();
    }
  }, [isInitialized, globalLoading, initializeApp]);

  // Session validation
  useEffect(() => {
    if (auth.isAuthenticated) {
      const interval = setInterval(() => {
        auth.validateSession();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [auth.isAuthenticated, auth.validateSession]);

  return {
    // State
    isInitialized,
    isLoading: globalLoading || isAnyLoading,
    hasError: !!hasAnyError || !!initializationError,
    
    // Store states
    auth: {
      ...auth,
      employeeName: auth.currentEmployee 
        ? `${auth.currentEmployee.firstName} ${auth.currentEmployee.lastName}` 
        : null,
    },
    customers,
    transactions,
    queue,
    products,
    
    // Actions
    initializeApp,
    setupScenario,
    loadCustomerData,
    clearAllErrors,
    refreshAllData,
    getHealthStatus,
    
    // Utilities
    cache: {
      clear: () => appCache.clear(),
      size: () => appCache.size(),
    },
  };
};