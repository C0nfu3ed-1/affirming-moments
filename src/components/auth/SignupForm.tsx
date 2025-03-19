
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { signUp } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import SignupFormFields from './signup/SignupFormFields';
import SignupButton from './signup/SignupButton';
import SignupError from './signup/SignupError';
import { useSignupFormValidation, SignupFormData } from './signup/useSignupFormValidation';

const SignupForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const { fieldErrors, setFieldErrors, validateForm } = useSignupFormValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field-specific error when user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { user, error } = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      });
      
      if (error) {
        setError(error.message);
        console.error('Signup error:', error);
        setIsLoading(false);
        return;
      }
      
      if (user) {
        toast.success('Account created successfully!', {
          description: "Welcome to Affirming Me Today!",
        });
        
        // Check if the user is an admin and redirect accordingly
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        if (profileData?.is_admin) {
          navigate('/admin');
        } else {
          navigate('/member');
        }
      } else {
        toast.info('Account created!', {
          description: "Please check your email to confirm your registration.",
        });
        navigate('/auth/login');
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 animate-scale-in shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Sign up to receive daily affirmations
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <SignupError error={error} />
          <SignupFormFields 
            formData={formData} 
            handleChange={handleChange} 
            fieldErrors={fieldErrors} 
          />
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <SignupButton isLoading={isLoading} />
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/auth/login" 
              className="text-primary-600 hover:text-primary-800 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignupForm;
