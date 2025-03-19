
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

const ProtectedRoute = ({ children, adminRequired = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // For admin routes, check if user is admin (implement this later)
  if (adminRequired) {
    // This is a placeholder for admin check
    // Implement proper admin check when ready
    const isUserAdmin = user?.user_metadata?.is_admin || false;
    
    if (!isUserAdmin) {
      return <Navigate to="/member" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
