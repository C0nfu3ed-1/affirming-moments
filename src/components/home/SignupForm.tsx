
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useSignup } from '@/hooks/useSignup';
import PersonalInfoStep from './signup/PersonalInfoStep';
import DonationStep from './signup/DonationStep';
import FormProgressBar from './signup/FormProgressBar';
import FormActionButtons from './signup/FormActionButtons';

const SignupForm = () => {
  const {
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
  } = useSignup();

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
