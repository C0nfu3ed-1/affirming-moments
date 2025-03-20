
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isResetMode, setIsResetMode] = useState(true);
  
  // Check if we're in reset mode or new password mode
  useEffect(() => {
    // If we have a token in the URL, we're in the password update phase
    const token = searchParams.get('token');
    if (token) {
      setIsResetMode(false);
    } else {
      setIsResetMode(true);
    }
  }, [searchParams]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {isResetMode ? (
              <ResetPasswordForm />
            ) : (
              <NewPasswordForm />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
