import { create } from 'zustand';
import { Employee } from '@/types';
import { authApi } from '@/api/mockApi';
import { normalizeError, logError } from '@/utils/errorHandling';

interface AuthState {
  currentEmployee: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginAttempt: Date | null;
  sessionValid: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  validateSession: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<Employee>) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  currentEmployee: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginAttempt: null,
  sessionValid: false,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null, lastLoginAttempt: new Date() });

    try {
      const employee = await authApi.login(email, password);

      set({
        currentEmployee: employee,
        isAuthenticated: true,
        sessionValid: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Auth Login');

      set({
        isLoading: false,
        error: normalizedError.message,
        isAuthenticated: false,
        sessionValid: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await authApi.logout();

      set({
        currentEmployee: null,
        isAuthenticated: false,
        sessionValid: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Auth Logout');

      // Even if logout fails, clear local state
      set({
        currentEmployee: null,
        isAuthenticated: false,
        sessionValid: false,
        isLoading: false,
        error: normalizedError.message,
      });
    }
  },

  validateSession: async () => {
    const { isAuthenticated } = get();

    if (!isAuthenticated) return;

    try {
      const isValid = await authApi.validateSession();
      set({ sessionValid: isValid });

      if (!isValid) {
        set({
          currentEmployee: null,
          isAuthenticated: false,
          sessionValid: false,
          error: 'Session expired. Please log in again.',
        });
      }
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Session Validation');

      set({
        sessionValid: false,
        error: normalizedError.message,
      });
    }
  },

  refreshAuth: async () => {
    const { currentEmployee } = get();

    if (!currentEmployee) return;

    set({ isLoading: true });

    try {
      await get().validateSession();
      set({ isLoading: false });
    } catch (error) {
      const normalizedError = normalizeError(error);
      logError(normalizedError, 'Auth Refresh');

      set({
        isLoading: false,
        error: normalizedError.message,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateProfile: async (data: Partial<Employee>) => {
    const { currentEmployee } = get();
    if (!currentEmployee) return;

    set({ isLoading: true });
    try {
      // Mock API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedEmployee = { ...currentEmployee, ...data };
      set({
        currentEmployee: updatedEmployee,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const normalizedError = normalizeError(error);
      set({ isLoading: false, error: normalizedError.message });
      throw error;
    }
  },
}));