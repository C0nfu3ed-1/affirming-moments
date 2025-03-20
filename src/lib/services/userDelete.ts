
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const deleteUserById = async (id: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete user with ID: ${id}`);
    
    // First delete user preferences
    const { error: prefError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', id);
    
    if (prefError) {
      console.error('Error deleting user preferences:', prefError);
      throw prefError;
    }
    
    console.log('Successfully deleted user preferences');
    
    // Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      throw profileError;
    }
    
    console.log('Successfully deleted user profile');
    
    // Note: Deleting the auth user requires admin rights through Supabase Edge Function
    // In a real app, you might want to use a Supabase Edge Function with admin rights
    
    toast.success('User deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    return false;
  }
};
