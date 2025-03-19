
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import FormProgressBar from './FormProgressBar';
import FormActionButtons from './FormActionButtons';
import PersonalInfoStep from './PersonalInfoStep';
import DonationStep from './DonationStep';
import { useSignup } from '@/hooks/useSignup';

const SignupFormContainer: React.FC = () => {
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
  );
};

export default SignupFormContainer;
