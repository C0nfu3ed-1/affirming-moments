
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

interface PersonalInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ formData, handleChange, errors }) => {
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
          required
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <div className="text-red-500 text-sm mt-1">{errors.name}</div>
        )}
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
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <div className="text-red-500 text-sm mt-1">{errors.email}</div>
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
          required
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && (
          <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
        )}
        <p className="text-xs text-gray-500 mt-1">
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
          required
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && (
          <div className="text-red-500 text-sm mt-1">{errors.password}</div>
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
          required
          className={`transition duration-200 focus:ring-2 focus:ring-primary-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
        />
        {errors.confirmPassword && (
          <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
        )}
      </div>
    </>
  );
};

export default PersonalInfoStep;
