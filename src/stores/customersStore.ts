import { create } from 'zustand';
import { Customer } from '@/types';
import { generateMockCustomers } from '@/data/mockData';

interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchResults: Customer[];
  isLoading: boolean;
  error: string | null;
}

interface CustomersActions {
  fetchCustomers: () => Promise<void>;
  searchCustomers: (query: string) => Promise<void>;
  getCustomerById: (id: string) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  addNote: (customerId: string, note: string, type: 'GENERAL' | 'IMPORTANT' | 'REMINDER') => Promise<void>;
  clearSelectedCustomer: () => void;
  clearError: () => void;
}

type CustomersStore = CustomersState & CustomersActions;

export const useCustomersStore = create<CustomersStore>((set, get) => ({
  // Initial state
  customers: [],
  selectedCustomer: null,
  searchResults: [],
  isLoading: false,
  error: null,

  // Actions
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const customers = generateMockCustomers();
      set({
        customers,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania klientów',
      });
    }
  },

  searchCustomers: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { customers } = get();
      const searchResults = customers.filter(customer => {
        const fullName = `${customer.personalInfo.firstName} ${customer.personalInfo.lastName}`.toLowerCase();
        const email = customer.personalInfo.email.toLowerCase();
        const phone = customer.personalInfo.phone.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        return fullName.includes(searchTerm) || 
               email.includes(searchTerm) || 
               phone.includes(searchTerm) ||
               customer.id.includes(searchTerm);
      });
      
      set({
        searchResults,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd wyszukiwania klientów',
      });
    }
  },

  getCustomerById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { customers } = get();
      const customer = customers.find(c => c.id === id);
      
      if (!customer) {
        throw new Error('Klient nie został znaleziony');
      }
      
      set({
        selectedCustomer: customer,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd pobierania danych klienta',
      });
    }
  },

  updateCustomer: async (id: string, updates: Partial<Customer>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { customers, selectedCustomer } = get();
      const updatedCustomers = customers.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      );
      
      const updatedSelectedCustomer = selectedCustomer?.id === id 
        ? { ...selectedCustomer, ...updates }
        : selectedCustomer;
      
      set({
        customers: updatedCustomers,
        selectedCustomer: updatedSelectedCustomer,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd aktualizacji danych klienta',
      });
    }
  },

  addNote: async (customerId: string, content: string, type: 'GENERAL' | 'IMPORTANT' | 'REMINDER') => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newNote = {
        id: `note_${Date.now()}`,
        content,
        createdAt: new Date(),
        createdBy: 'current_employee', // In real app, get from auth store
        type,
      };
      
      const { customers, selectedCustomer } = get();
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, notes: [...customer.notes, newNote] }
          : customer
      );
      
      const updatedSelectedCustomer = selectedCustomer?.id === customerId
        ? { ...selectedCustomer, notes: [...selectedCustomer.notes, newNote] }
        : selectedCustomer;
      
      set({
        customers: updatedCustomers,
        selectedCustomer: updatedSelectedCustomer,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd dodawania notatki',
      });
    }
  },

  clearSelectedCustomer: () => {
    set({ selectedCustomer: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));