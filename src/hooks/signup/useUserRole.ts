
import { supabase } from '@/lib/supabase';

export const checkIfAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data?.is_admin || false;
  } catch (error) {
    console.error("Error in checkIfAdmin:", error);
    return false;
  }
};
