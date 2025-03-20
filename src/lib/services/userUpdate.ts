
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const updateUserDetails = async (
  id: string, 
  data: {
    name?: string;
    email?: string;
    isActive?: boolean;
    categories?: string[];
  }
): Promise<boolean> => {
  try {
    console.log('Updating user with data:', data);
    
    // Update profile data if name or email is provided
    if (data.name || data.email) {
      const profileData: { name?: string; email?: string } = {};
      if (data.name) profileData.name = data.name;
      if (data.email) profileData.email = data.email;
      
      console.log('Updating profile with:', profileData);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id);
      
      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }
    }
    
    // Update preferences if isActive or categories is provided
    if (data.isActive !== undefined || data.categories) {
      const prefData: { is_active?: boolean; categories?: string[] } = {};
      
      // Explicitly include isActive, even if it's false
      if (data.isActive !== undefined) {
        prefData.is_active = data.isActive;
        console.log(`Setting is_active to ${data.isActive}`);
      }
      
      if (data.categories) {
        prefData.categories = data.categories;
      }
      
      console.log('Updating preferences with:', prefData);
      
      // First check if a preference record exists
      const { data: existingPref, error: checkError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking for existing preferences:', checkError);
        throw checkError;
      }
      
      let prefError;
      
      if (existingPref) {
        // Update existing preference
        const { error } = await supabase
          .from('user_preferences')
          .update(prefData)
          .eq('user_id', id);
        
        prefError = error;
      } else {
        // Create preference if it doesn't exist
        // Ensure categories is always provided as an array, even if empty
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: id,
            categories: data.categories || [], // Ensure this is always an array
            time_preference: 'morning', // Default value
            is_active: data.isActive !== undefined ? data.isActive : true
          });
        
        prefError = error;
      }
      
      if (prefError) {
        console.error('Preferences update error:', prefError);
        throw prefError;
      }
    }
    
    toast.success('User updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
    return false;
  }
};
