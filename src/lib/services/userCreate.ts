
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const createUser = async (
  userData: {
    name: string;
    email: string;
    phone: string;
    isAdmin?: boolean;
    isActive?: boolean;
    categories?: string[];
  }
): Promise<{id: string} | null> => {
  try {
    console.log('Creating user with data:', userData);
    
    // Generate a UUID for the new user
    const userId = crypto.randomUUID();
    
    // Create user profile using RPC function to bypass RLS
    const { data, error: rpcError } = await supabase.rpc(
      'create_user_profile',
      {
        user_id: userId,
        user_name: userData.name,
        user_email: userData.email,
        user_phone: userData.phone || '',
        is_user_admin: userData.isAdmin || false
      }
    );
    
    if (rpcError) throw rpcError;
    
    // Fetch the created user to get its ID
    const { data: newUser, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userData.email)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Create user preferences if categories are provided
    if (userData.categories && userData.categories.length > 0) {
      const { error: prefError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: newUser.id,
          categories: userData.categories,
          time_preference: 'morning', // Default value
          is_active: userData.isActive !== undefined ? userData.isActive : true
        });
      
      if (prefError) throw prefError;
    }
    
    toast.success('User created successfully');
    return { id: newUser.id };
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
    return null;
  }
};
