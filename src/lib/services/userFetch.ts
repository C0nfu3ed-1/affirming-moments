
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AdminUser } from '@/hooks/useAdminUsers';

export const fetchAllUsers = async (): Promise<AdminUser[] | null> => {
  try {
    // Fetch all users from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;

    // Fetch all user preferences to get additional data
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*');
    
    if (preferencesError) throw preferencesError;

    // Combine the data
    const combinedUsers = profiles.map(profile => {
      const userPrefs = preferences.find(pref => pref.user_id === profile.id);
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        isActive: userPrefs?.is_active || false,
        categories: userPrefs?.categories || [],
        created_at: profile.created_at
      };
    });

    return combinedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to load users');
    return null;
  }
};
