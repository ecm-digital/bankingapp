import { create } from 'zustand';
import { Transaction } from '@/types';
import { generateMockTransactions } from '@/data/mockData';

interface TransactionsState {
  transactions: Transaction[];
  customerTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface TransactionsActions {
  fetchTransactions: () => Promise<void>;
  fetchCustomerTransactions: (customerId: string) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>) => Promise<Transaction>;
  updateTransactionStatus: (id: string, status: Transaction['status']) => Promise<void>;
  clearError: () => void;
}

type TransactionsStore = TransactionsState & TransactionsActions;

export const useTransactionsStore = create<TransactionsStore>((set, get) => ({
  // Initial state
  transactions: [],
  customerTransactions: [],
  isLoading: false,
  error: null,

  // Actions
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transactions = generateMockTransactions();
      set({
        transactions,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania transakcji',
      });
    }
  },

  fetchCustomerTransactions: async (customerId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { transactions } = get();
      const customerTransactions = transactions.filter(t => t.customerId === customerId);
      
      set({
        customerTransactions,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania transakcji klienta',
      });
    }
  },

  createTransaction: async (transactionData: Omit<Transaction, 'id' | 'timestamp' | 'referenceNumber'>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: `tx_${Date.now()}`,
        timestamp: new Date(),
        referenceNumber: `TXN${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
      };
      
      const { transactions } = get();
      const updatedTransactions = [newTransaction, ...transactions];
      
      set({
        transactions: updatedTransactions,
        isLoading: false,
      });
      
      return newTransaction;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd tworzenia transakcji',
      });
      throw error;
    }
  },

  updateTransactionStatus: async (id: string, status: Transaction['status']) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { transactions } = get();
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === id ? { ...transaction, status } : transaction
      );
      
      set({
        transactions: updatedTransactions,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd aktualizacji statusu transakcji',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));