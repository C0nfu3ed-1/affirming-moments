
import { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { supabase } from '@/lib/supabase';
import PersonalInfoStep from './signup/PersonalInfoStep';
import DonationStep from './signup/DonationStep';
import FormProgressBar from './signup/FormProgressBar';
import FormActionButtons from './signup/FormActionButtons';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    donation: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = "Invalid phone number format";
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (nextStep: number) => {
    if (nextStep > step) {
      // Only validate when moving forward
      if (step === 1 && !validateForm()) {
        return;
      }
    }
    setStep(nextStep);
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateForm()) {
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
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        donation: false
      });
      setErrors({});
      setStep(1);
      setCaptchaValue(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
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

  return (
    <section id="signup" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Affirmation Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sign up today to receive daily affirmations tailored to your preferences.
          </p>
        </div>

        <Card className="max-w-md mx-auto border border-gray-200 dark:border-gray-800 animate-scale-in shadow-xl">
          <CardHeader>
            <FormProgressBar currentStep={step} totalSteps={2} />
            <CardTitle>
              {step === 1 ? 'Personal Information' : 'Support Our Mission'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Enter your details to sign up for daily affirmations'
                : 'Consider a donation to help us reach more people'
              }
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {step === 1 ? (
                <PersonalInfoStep formData={formData} handleChange={handleChange} errors={errors} />
              ) : (
                <DonationStep 
                  formData={formData} 
                  handleChange={handleChange} 
                  recaptchaRef={recaptchaRef} 
                  handleCaptchaChange={handleCaptchaChange} 
                />
              )}
            </CardContent>
            <CardFooter>
              <FormActionButtons 
                currentStep={step} 
                totalSteps={2} 
                isLoading={isLoading} 
                isCaptchaVerified={!!captchaValue} 
                onBack={() => goToStep(step - 1)} 
                onNext={() => goToStep(step + 1)} 
              />
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default SignupForm;
