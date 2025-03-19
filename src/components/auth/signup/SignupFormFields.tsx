
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupFieldErrors } from './useSignupFormValidation';

interface SignupFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: SignupFieldErrors;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({ 
  formData, 
  handleChange, 
  fieldErrors 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${
            fieldErrors.name ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${
            fieldErrors.email ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
        )}
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
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${
            fieldErrors.phone ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.phone && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
        )}
        <p className="text-xs text-gray-500">
          We'll send affirmations to this number. Standard message rates apply.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${
            fieldErrors.password ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.password && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${
            fieldErrors.confirmPassword ? 'border-red-500' : ''
          }`}
        />
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
        )}
      </div>
    </>
  );
};

export default SignupFormFields;
