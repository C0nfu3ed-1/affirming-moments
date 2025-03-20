
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { checkIfAdmin } from '@/hooks/signup/useUserRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminRequired?: boolean;
}

const ProtectedRoute = ({ children, adminRequired = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(adminRequired);

  // Check admin status when component mounts if admin route is required
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (adminRequired && user) {
        setIsCheckingAdmin(true);
        const adminStatus = await checkIfAdmin(user.id);
        setIsAdmin(adminStatus);
        setIsCheckingAdmin(false);
      }
    };

    if (user) {
      verifyAdminStatus();
    }
  }, [adminRequired, user]);
  
  // Show loading state
  if (isLoading || isCheckingAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // For admin routes, check if user is admin
  if (adminRequired && !isAdmin) {
    return <Navigate to="/member" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
