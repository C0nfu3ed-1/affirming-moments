
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define the correct types for our RPC function
type CreateUserProfileParams = {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  is_user_admin: boolean;
  password: string;
};

export const createUser = async (
  userData: {
    name: string;
    email: string;
    phone: string;
    isAdmin?: boolean;
    isActive?: boolean;
    categories?: string[];
    password: string;
  }
): Promise<{ id: string } | null> => {
  try {
    console.log('Creating user with data:', userData);

    // 🔹 Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      phone: userData.phone ? userData.phone : undefined,
    });

    if (authError) throw authError;
    const userId = authData.user?.id;
    if (!userId) throw new Error('User ID not returned after sign-up');


    // 🔹 Create user profile using Supabase RPC function
    const { data, error: profileCreateError } = await supabase.from('profiles').upsert({
      id: userId,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      is_admin: userData.isAdmin !== undefined ? userData.isAdmin : false,
    })
    if (profileCreateError) throw profileCreateError;

    // 🔹 Create user preferences if categories are provided
    if (userData.categories && userData.categories.length > 0) {
      const { error: prefError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          categories: userData.categories,
          time_preference: 'morning', // Default value
          is_active: userData.isActive !== undefined ? userData.isActive : true,
        });

      if (prefError) throw prefError;
    }

    toast.success('User created successfully');
    return { id: userId };
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
    return null;
  }
};
