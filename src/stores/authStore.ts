import { create } from 'zustand';
import { Employee } from '@/types';
import { generateMockEmployees } from '@/data/mockData';

interface AuthState {
  currentEmployee: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  currentEmployee: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - find employee by email
      const employees = generateMockEmployees();
      const employee = employees.find(emp => emp.email === email);
      
      if (!employee || password !== 'password123') {
        throw new Error('Nieprawidłowe dane logowania');
      }
      
      set({
        currentEmployee: employee,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Błąd logowania',
      });
    }
  },

  logout: () => {
    set({
      currentEmployee: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));