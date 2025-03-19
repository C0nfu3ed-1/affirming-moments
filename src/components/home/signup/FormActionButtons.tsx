
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  isCaptchaVerified: boolean;
  onBack: () => void;
  onNext: () => void;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({ 
  currentStep, 
  totalSteps, 
  isLoading, 
  isCaptchaVerified, 
  onBack, 
  onNext 
}) => {
  return (
    <div className="flex justify-between w-full">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
      )}
      {currentStep < totalSteps ? (
        <Button
          type="button"
          className="ml-auto bg-primary-600 hover:bg-primary-700 text-white"
          onClick={onNext}
        >
          Next Step
        </Button>
      ) : (
        <Button
          type="submit"
          className="ml-auto bg-primary-600 hover:bg-primary-700 text-white"
          disabled={isLoading || !isCaptchaVerified}
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
  );
};

export default FormActionButtons;
