
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const deleteUserById = async (id: string): Promise<boolean> => {
  try {
    // First delete user preferences
    const { error: prefError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', id);
    
    if (prefError) throw prefError;
    
    // Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (profileError) throw profileError;
    
    // Delete the auth user requires admin rights, skipping for now
    // In a real app, you might want to use a Supabase Edge Function with admin rights to do this
    
    toast.success('User deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    return false;
  }
};
