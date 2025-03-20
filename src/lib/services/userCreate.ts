
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const createUser = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string,
  isActive: boolean = true
): Promise<{ success: boolean; error?: any }> => {
  try {
    // Check for valid email format explicitly
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return { success: false, error: 'Invalid email format' };
    }
    
    // Sign up the new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    });
    
    if (authError) {
      console.error('Auth error:', authError);
      toast.error('Failed to add user', {
        description: authError.message
      });
      return { success: false, error: authError };
    }
    
    if (!authData.user) {
      toast.error('Failed to create user');
      return { success: false, error: 'No user data returned' };
    }
    
    // Create the profile record using a function instead of direct insertion
    // This is a workaround for the RLS policy issue
    const { data: profileData, error: functionError } = await supabase.rpc('create_user_profile', {
      user_id: authData.user.id,
      user_name: name,
      user_email: email,
      user_phone: phone,
      is_user_admin: false
    });
    
    if (functionError) {
      console.error('Profile creation error:', functionError);
      toast.error('Error creating profile', {
        description: functionError.message
      });
      return { success: false, error: functionError };
    }
    
    // Create default user preferences
    const { error: prefError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: authData.user.id,
        categories: ['morning', 'confidence'],
        time_preference: 'morning',
        is_active: isActive,
      });
    
    if (prefError) {
      console.error('Preferences error:', prefError);
      toast.error('Error creating user preferences', {
        description: prefError.message
      });
      return { success: false, error: prefError };
    }
    
    toast.success('User added successfully');
    return { success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    toast.error('Failed to add user');
    return { success: false, error };
  }
};
