
import { supabase } from '@/lib/supabase';

export const checkIfAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking admin status for user ID:', userId);
    console.log('User ID type:', typeof userId);
    
    // Check for whitespace and trim if necessary
    const trimmedUserId = userId.trim();
    if (trimmedUserId !== userId) {
      console.log('Whitespace detected in user ID, trimmed from:', userId, 'to:', trimmedUserId);
      userId = trimmedUserId;
    }
    
    // Log the exact query we're about to make
    console.log('Running query: SELECT is_admin FROM profiles WHERE id =', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    console.log('Admin check result:', data);
    return data?.is_admin || false;
  } catch (error) {
    console.error("Error in checkIfAdmin:", error);
    return false;
  }
};
