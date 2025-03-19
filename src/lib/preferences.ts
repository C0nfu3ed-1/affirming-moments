
import { supabase } from './supabase';
import { toast } from 'sonner';

// Get user preferences
export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no preferences found, we'll create default ones
      if (error.code === 'PGRST116') {
        const { data: newData, error: createError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            categories: ['morning', 'confidence'],
            time_preference: 'morning',
            is_active: true,
          })
          .select()
          .single();

        if (createError) {
          toast.error('Error creating preferences', {
            description: createError.message,
          });
          return { preferences: null, error: createError };
        }

        return { preferences: newData, error: null };
      }

      toast.error('Error fetching preferences', {
        description: error.message,
      });
      return { preferences: null, error };
    }

    return { preferences: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { preferences: null, error };
  }
};

// Update user preferences
export const updateUserPreferences = async (
  userId: string,
  categories: string[],
  timePreference: string,
  isActive: boolean
) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        categories,
        time_preference: timePreference,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      toast.error('Error updating preferences', {
        description: error.message,
      });
      return { preferences: null, error };
    }

    toast.success('Preferences updated successfully');
    return { preferences: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { preferences: null, error };
  }
};

// Delete a user's account and preferences
export const deleteUserAccount = async (userId: string) => {
  try {
    // First delete user preferences
    const { error: prefError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', userId);

    if (prefError) {
      toast.error('Error deleting preferences', {
        description: prefError.message,
      });
      return { error: prefError };
    }

    // Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      toast.error('Error deleting profile', {
        description: profileError.message,
      });
      return { error: profileError };
    }

    // Delete auth user (will be handled by Supabase's cascade delete)
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { error };
  }
};
