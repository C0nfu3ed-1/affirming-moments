
import { supabase } from './supabase';
import { toast } from 'sonner';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

// Sign in a user
export const signIn = async ({ email, password }: SignInCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Sign in error', {
        description: error.message,
      });
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { user: null, error };
  }
};

// Sign up a new user
export const signUp = async ({ email, password, name, phone }: SignUpCredentials) => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      toast.error('Sign up error', {
        description: authError.message,
      });
      return { user: null, error: authError };
    }

    // If user was created successfully, create the profile record
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          email,
          phone,
          is_admin: false,
        });

      if (profileError) {
        toast.error('Error creating profile', {
          description: profileError.message,
        });
        return { user: authData.user, error: profileError };
      }

      // Create default user preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: authData.user.id,
          categories: ['morning', 'confidence'], // Default categories
          time_preference: 'morning', // Default time
          is_active: true,
        });

      if (prefError) {
        toast.error('Error creating user preferences', {
          description: prefError.message,
        });
        return { user: authData.user, error: prefError };
      }
    }

    return { user: authData.user, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { user: null, error };
  }
};

// Sign out a user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Sign out error', {
        description: error.message,
      });
      return { error };
    }
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { error };
  }
};

// Get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return { user: null, error };
    }
    return { user: data.user, error: null };
  } catch (err) {
    const error = err as Error;
    return { user: null, error };
  }
};

// Check if the current user is an admin
export const isAdmin = async () => {
  try {
    const { user, error } = await getCurrentUser();
    if (error || !user) {
      return false;
    }

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return data?.is_admin || false;
  } catch {
    return false;
  }
};
