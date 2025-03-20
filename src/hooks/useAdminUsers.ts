import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@/lib/types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  categories: string[];
  created_at: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
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

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (name: string, email: string, phone: string, password: string) => {
    try {
      // Use the provided password instead of generating a random one
      
      // Sign up the new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // Create the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          email,
          phone,
          is_admin: false,
        });
      
      if (profileError) throw profileError;
      
      // Create default user preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: authData.user.id,
          categories: ['morning', 'confidence'],
          time_preference: 'morning',
          is_active: true,
        });
      
      if (prefError) throw prefError;
      
      toast.success('User added successfully');
      await fetchUsers(); // Refresh the user list
      
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      return { success: false, error };
    }
  };
  
  const updateUser = async (id: string, data: {
    name?: string;
    email?: string;
    isActive?: boolean;
    categories?: string[];
  }) => {
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
          // Fix: Ensure categories is always provided as an array, even if empty
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
      await fetchUsers(); // Refresh the user list
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      return false;
    }
  };
  
  const deleteUser = async (id: string) => {
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
      await fetchUsers(); // Refresh the user list
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  };

  const exportUsers = () => {
    try {
      // Create CSV content
      const headers = ['Name', 'Email', 'Status', 'Categories', 'Created At'];
      const csvRows = [headers];
      
      users.forEach(user => {
        csvRows.push([
          user.name,
          user.email,
          user.isActive ? 'Active' : 'Inactive',
          user.categories.join(', '),
          new Date(user.created_at).toLocaleDateString()
        ]);
      });
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Users exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    exportUsers
  };
};
