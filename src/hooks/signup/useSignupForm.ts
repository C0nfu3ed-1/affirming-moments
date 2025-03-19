
import { useState } from 'react';
import { FormData, FormErrors, validateSignupForm } from './useSignupValidation';

export const useSignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    donation: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);

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

  const validateForm = async (): Promise<boolean> => {
    const newErrors = await validateSignupForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = async (nextStep: number) => {
    if (nextStep > step) {
      // Only validate when moving forward
      if (step === 1) {
        const isValid = await validateForm();
        if (!isValid) {
          return;
        }
      }
    }
    setStep(nextStep);
  };

  const resetForm = () => {
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
  };

  return {
    formData,
    errors,
    step,
    handleChange,
    validateForm,
    goToStep,
    resetForm,
    setFormData
  };
};
