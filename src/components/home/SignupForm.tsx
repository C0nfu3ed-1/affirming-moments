
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
import PersonalInfoStep from './signup/PersonalInfoStep';
import DonationStep from './signup/DonationStep';
import FormProgressBar from './signup/FormProgressBar';
import FormActionButtons from './signup/FormActionButtons';

const SignupForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    donation: false
  });
  const [step, setStep] = useState(1);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValue) {
      toast({
        title: "Verification Required",
        description: "Please complete the reCAPTCHA verification.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.donation) {
        // Redirect to PayPal would happen here
        window.open('https://paypal.com', '_blank');
      }
      toast({
        title: "Success!",
        description: "You've been signed up for daily affirmations.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        donation: false
      });
      setStep(1);
      setCaptchaValue(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }, 1500);
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
                <PersonalInfoStep formData={formData} handleChange={handleChange} />
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
