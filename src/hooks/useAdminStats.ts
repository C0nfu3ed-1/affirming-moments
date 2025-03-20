
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  messagesSent: number;
  categories: number;
  loading: boolean;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscribers: 0,
    messagesSent: 0,
    categories: 0,
    loading: true
  });

  const fetchStats = async () => {
    try {
      // Fetch total users count
      const { count: totalUsersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;

      // Fetch active subscribers
      const { count: activeSubscribersCount, error: subError } = await supabase
        .from('user_preferences')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (subError) throw subError;

      // Fetch total messages sent
      const { count: messagesSentCount, error: messagesError } = await supabase
        .from('message_logs')
        .select('*', { count: 'exact', head: true });
      
      if (messagesError) throw messagesError;

      // Fetch categories count
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      
      if (categoriesError) throw categoriesError;

      // Update state with real data
      setStats({
        totalUsers: totalUsersCount || 0,
        activeSubscribers: activeSubscribersCount || 0,
        messagesSent: messagesSentCount || 0,
        categories: categoriesCount || 0,
        loading: false
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load dashboard statistics');
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return stats;
};
