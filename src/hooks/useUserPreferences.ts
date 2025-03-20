
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getUserPreferences, updateUserPreferences } from '@/lib/preferences';
import { supabase } from '@/lib/supabase';

export const useUserPreferences = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('morning');
  const [userId, setUserId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  
  // Fetch current user and their preferences
  useEffect(() => {
    const fetchUserAndPreferences = async () => {
      setIsLoading(true);
      
      // Get current authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      const currentUserId = session.user.id;
      setUserId(currentUserId);
      
      // Fetch user preferences
      const { preferences } = await getUserPreferences(currentUserId);
      
      if (preferences) {
        setSelectedCategories(preferences.categories || []);
        setSelectedTime(preferences.time_preference || 'morning');
        setIsActive(preferences.is_active);
      }
      
      setIsLoading(false);
    };
    
    fetchUserAndPreferences();
  }, [navigate]);
  
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };
  
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };
  
  const savePreferences = async () => {
    if (!userId) {
      toast.error('You must be logged in to save preferences');
      return false;
    }
    
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return false;
    }
    
    setIsLoading(true);
    
    const result = await updateUserPreferences(
      userId,
      selectedCategories,
      selectedTime,
      isActive
    );
    
    setIsLoading(false);
    
    if (result.error) {
      toast.error('Failed to save preferences');
      return false;
    } else {
      toast.success('Your preferences have been saved');
      return true;
    }
  };
  
  const cancelSubscription = async () => {
    if (!userId) {
      toast.error('You must be logged in to cancel your subscription');
      return false;
    }
    
    setIsLoading(true);
    
    const result = await updateUserPreferences(
      userId,
      selectedCategories,
      selectedTime,
      false // Set the user as inactive
    );
    
    setIsLoading(false);
    
    if (result.error) {
      toast.error('Failed to cancel subscription');
      return false;
    } else {
      setIsActive(false);
      toast.success('Your subscription has been cancelled');
      return true;
    }
  };

  return {
    isLoading,
    selectedCategories,
    selectedTime,
    userId,
    isActive,
    handleCategoryChange,
    handleTimeChange,
    savePreferences,
    cancelSubscription
  };
};
