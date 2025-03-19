
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { authType } = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/member');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determine which form to show
  const renderAuthForm = () => {
    switch (authType) {
      case 'signup':
        return <SignupForm />;
      case 'login':
      default:
        return <LoginForm />;
    }
  };

  // Get title based on auth type
  const getTitle = () => {
    switch (authType) {
      case 'signup':
        return 'Create Account';
      case 'login':
      default:
        return 'Sign In';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 hidden">
              {getTitle()}
            </h1>
            {renderAuthForm()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
