
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { useSignupForm } from './signup/useSignupForm';
import { checkIfAdmin } from './signup/useUserRole';

export interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  donation: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const useSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const {
    formData,
    errors,
    step,
    handleChange,
    validateForm,
    goToStep,
    resetForm
  } = useSignupForm();

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      const isValid = await validateForm();
      if (isValid) {
        goToStep(2);
      }
      return;
    }
    
    if (!captchaValue) {
      toast({
        title: "Verification Required",
        description: "Please complete the reCAPTCHA verification.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (formData.donation) {
        // Redirect to PayPal would happen here
        window.open('https://paypal.com', '_blank');
      }
      
      toast({
        title: "Success!",
        description: data.user ? "You've been signed up for daily affirmations." : "Please check your email to confirm your registration.",
        variant: "default",
      });
      
      // Reset form
      resetForm();
      setCaptchaValue(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      
      // Redirect based on user role
      if (data.user) {
        const isUserAdmin = await checkIfAdmin(data.user.id);
        if (isUserAdmin) {
          navigate('/admin');
        } else {
          navigate('/member');
        }
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    step,
    isLoading,
    captchaValue,
    recaptchaRef,
    handleChange,
    goToStep,
    handleCaptchaChange,
    handleSubmit
  };
};
