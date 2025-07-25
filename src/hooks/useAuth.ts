import { useAuthStore } from '@/stores/authStore';
import { useCallback } from 'react';

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
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Błąd logowania' 
      };
    }
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
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
  };
};