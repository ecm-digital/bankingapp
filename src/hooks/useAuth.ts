import { useAuthStore } from '@/stores/authStore';
import { useCallback } from 'react';
import { normalizeError } from '@/utils/errorHandling';

export const useAuth = () => {
  const {
    currentEmployee,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  } = useAuthStore();

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);
      return { 
        success: false, 
        error: normalizedError.message,
        code: normalizedError.code,
        recoverable: normalizedError.recoverable,
      };
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);
      return { 
        success: false, 
        error: normalizedError.message 
      };
    }
  }, [logout]);

  return {
    // State
    currentEmployee,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError,
    
    // Computed
    isEmployee: !!currentEmployee,
    employeeName: currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : null,
    employeeRole: currentEmployee?.role,
    sessionValid: useAuthStore(state => state.sessionValid),
    lastLoginAttempt: useAuthStore(state => state.lastLoginAttempt),
  };
};