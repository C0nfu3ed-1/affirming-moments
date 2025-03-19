
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

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
            <div className="flex justify-between items-center mb-2">
              {[1, 2].map((i) => (
                <div 
                  key={i}
                  className={`flex items-center ${i < 2 ? 'w-full' : ''}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step >= i 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > i ? <Check size={16} /> : i}
                  </div>
                  {i < 2 && (
                    <div 
                      className={`h-1 w-full ${
                        step > i ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
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
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="transition duration-200 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="transition duration-200 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="transition duration-200 focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send affirmations to this number. Standard message rates apply.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4 py-4">
                    <div className="rounded-lg bg-primary-50 p-4 border border-primary-100">
                      <h4 className="font-medium text-primary-800 mb-2">Support Our Mission</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Your donation helps us provide affirmations to those who need them most but can't afford it.
                      </p>
                      <div className="flex items-center">
                        <input
                          id="donation"
                          name="donation"
                          type="checkbox"
                          checked={formData.donation}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="donation" className="ml-2 block text-sm text-gray-700">
                          Yes, I'd like to donate through PayPal
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="mb-2 text-sm text-gray-600">Please verify you're human</div>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key, replace with your actual site key in production
                      onChange={handleCaptchaChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This helps us prevent spam and automated signups.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToStep(1)}
                  >
                    Back
                  </Button>
                )}
                {step === 1 ? (
                  <Button
                    type="button"
                    className="ml-auto bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={() => goToStep(2)}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isLoading || !captchaValue}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default SignupForm;
