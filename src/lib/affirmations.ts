
import { supabase } from './supabase';
import { toast } from 'sonner';

// Fetch all affirmations (admin only)
export const getAllAffirmations = async () => {
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching affirmations', {
        description: error.message,
      });
      return { affirmations: null, error };
    }

    return { affirmations: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { affirmations: null, error };
  }
};

// Fetch affirmations by category
export const getAffirmationsByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .eq('category', category);

    if (error) {
      toast.error('Error fetching affirmations', {
        description: error.message,
      });
      return { affirmations: null, error };
    }

    return { affirmations: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { affirmations: null, error };
  }
};

// Create a new affirmation (admin only)
export const createAffirmation = async (text: string, category: string) => {
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .insert({
        text,
        category,
      })
      .select()
      .single();

    if (error) {
      toast.error('Error creating affirmation', {
        description: error.message,
      });
      return { affirmation: null, error };
    }

    toast.success('Affirmation created successfully');
    return { affirmation: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { affirmation: null, error };
  }
};

// Update an affirmation (admin only)
export const updateAffirmation = async (id: string, text: string, category: string) => {
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .update({
        text,
        category,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Error updating affirmation', {
        description: error.message,
      });
      return { affirmation: null, error };
    }

    toast.success('Affirmation updated successfully');
    return { affirmation: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { affirmation: null, error };
  }
};

// Delete an affirmation (admin only)
export const deleteAffirmation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('affirmations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting affirmation', {
        description: error.message,
      });
      return { error };
    }

    toast.success('Affirmation deleted successfully');
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { error };
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Error fetching categories', {
        description: error.message,
      });
      return { categories: null, error };
    }

    return { categories: data, error: null };
  } catch (err) {
    const error = err as Error;
    toast.error('Unexpected error', {
      description: error.message,
    });
    return { categories: null, error };
  }
};
