
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ formData, handleChange }) => {
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
  );
};

export default PersonalInfoStep;
