
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const deleteUserById = async (id: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete user with ID: ${id}`);
    // // First check if user preferences exist (old code )
    // const { data: prefData } = await supabase
    //   .from('user_preferences')
    //   .select('id')
    //   .eq('user_id', id);

    // // Delete user preferences if they exist
    // if (prefData && prefData.length > 0) {
    //   console.log('User preferences found, deleting...');
    //   const { error: prefError } = await supabase
    //     .from('user_preferences')
    //     .delete()
    //     .eq('user_id', id);

    //   if (prefError) {
    //     console.error('Error deleting user preferences:', prefError);
    //     throw prefError;
    //   }

    //   console.log('Successfully deleted user preferences');
    // } else {
    //   console.log('No user preferences found for this user');
    // }

    // // Delete user profile
    // const { error: profileError } = await supabase
    //   .from('profiles')
    //   .delete()
    //   .eq('id', id);

    // if (profileError) {
    //   console.error('Error deleting user profile:', profileError);
    //   throw profileError;
    // }
    // const { error: profileError } = await supabase
    // .from('profiles')
    // .delete()
    // .eq('id', id);


    // created a new RPC function to delete user profile and auth user in one go you can check this in the supabase dashboard database functions section
    // This function will handle both deleting the user profile and the auth user
    // in a single transaction, ensuring that both operations are atomic. 
    const { error: authError } = await supabase.rpc('delete_user', {
      user_id: id,
    });

    if (authError) {
      console.error('Error deleting user from auth:', authError);
      throw authError;
    }

    console.log('Successfully deleted user profile');

    toast.success('User deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    return false;
  }
};
