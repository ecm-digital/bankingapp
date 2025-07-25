import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

// Mock authentication - in a real app this would check actual auth state
const useAuth = () => {
  // For prototype purposes, always return authenticated
  return {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Katarzyna Wiśniewska',
      role: 'advisor',
      email: 'k.wisniewska@bank.pl'
    }
  };
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}