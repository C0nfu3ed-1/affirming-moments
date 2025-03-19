
import React from 'react';
import { Check } from 'lucide-react';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgressBar: React.FC<FormProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
        <div 
          key={i}
          className={`flex items-center ${i < totalSteps ? 'w-full' : ''}`}
        >
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep >= i 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {currentStep > i ? <Check size={16} /> : i}
          </div>
          {i < totalSteps && (
            <div 
              className={`h-1 w-full ${
                currentStep > i ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormProgressBar;
