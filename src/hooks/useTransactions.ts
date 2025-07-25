import { useTransactionsStore } from '@/stores/transactionsStore';
import { useCallback, useEffect } from 'react';
import { Transaction } from '@/types';

export const useTransactions = () => {
  const {
    transactions,
    customerTransactions,
    isLoading,
    error,
    fetchTransactions,
    fetchCustomerTransactions,
    createTransaction,
    updateTransactionStatus,
    clearError,
  } = useTransactionsStore();

  // Auto-fetch transactions on mount
  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, [transactions.length, fetchTransactions]);

  const handleCreateTransaction = useCallback(async (
    transactionData: Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>
  ) => {
    try {
      const newTransaction = await createTransaction(transactionData);
      return { success: true, transaction: newTransaction };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error creating transaction' 
      };
    }
  }, [createTransaction]);

  const handleFetchCustomerTransactions = useCallback(async (customerId: string) => {
    await fetchCustomerTransactions(customerId);
  }, [fetchCustomerTransactions]);

  const handleUpdateStatus = useCallback(async (
    transactionId: string, 
    status: Transaction['status']
  ) => {
    try {
      await updateTransactionStatus(transactionId, status);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Status update error' 
      };
    }
  }, [updateTransactionStatus]);

  // Helper functions for transaction categorization
  const getTransactionsByStatus = useCallback((status: Transaction['status']) => {
    return transactions.filter(t => t.status === status);
  }, [transactions]);

  const getTransactionsByType = useCallback((type: Transaction['type']) => {
    return transactions.filter(t => t.type === type);
  }, [transactions]);

  const getTodaysTransactions = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate.getTime() === today.getTime();
    });
  }, [transactions]);

  const getTransactionTotal = useCallback((transactionList: Transaction[]) => {
    return transactionList.reduce((total, t) => total + t.amount, 0);
  }, []);

  return {
    // State
    transactions,
    customerTransactions,
    isLoading,
    error,
    
    // Actions
    fetchTransactions,
    fetchCustomerTransactions: handleFetchCustomerTransactions,
    createTransaction: handleCreateTransaction,
    updateTransactionStatus: handleUpdateStatus,
    clearError,
    
    // Computed
    hasTransactions: transactions.length > 0,
    hasCustomerTransactions: customerTransactions.length > 0,
    pendingTransactions: getTransactionsByStatus('PENDING'),
    completedTransactions: getTransactionsByStatus('COMPLETED'),
    failedTransactions: getTransactionsByStatus('FAILED'),
    todaysTransactions: getTodaysTransactions(),
    
    // Helper functions
    getTransactionsByStatus,
    getTransactionsByType,
    getTodaysTransactions,
    getTransactionTotal,
  };
};