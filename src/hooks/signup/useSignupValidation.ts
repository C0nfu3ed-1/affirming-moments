
import { supabase } from '@/lib/supabase';

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  donation: boolean;
}

export const validateSignupForm = async (formData: FormData): Promise<FormErrors> => {
  const errors: FormErrors = {};
  
  // Validate name
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }
  
  // Validate email
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Invalid email address";
  }
  
  // Validate phone
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
    errors.phone = "Invalid phone number format";
  } else {
    // Check if phone number already exists in the database
    const { data, error } = await supabase
      .from('profiles')
      .select('phone')
      .eq('phone', formData.phone)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking phone number:", error);
    }
    
    if (data) {
      errors.phone = "This phone number is already in use";
    }
  }
  
  // Validate password
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  
  // Validate confirm password
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  return errors;
};
