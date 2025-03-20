
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { startOfMonth, subMonths, endOfMonth, format } from 'date-fns';

export interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  messagesSent: number;
  categories: number;
  userChange: string;
  subChange: string;
  msgChange: string;
  catChange: string;
  loading: boolean;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSubscribers: 0,
    messagesSent: 0,
    categories: 0,
    userChange: "0%",
    subChange: "0%",
    msgChange: "0%",
    catChange: "0%",
    loading: true
  });

  const calculatePercentChange = (current: number, previous: number): string => {
    if (previous === 0) {
      return current > 0 ? "+∞%" : "0%";
    }
    
    const percentChange = ((current - previous) / previous) * 100;
    const sign = percentChange > 0 ? "+" : "";
    return `${sign}${percentChange.toFixed(1)}%`;
  };

  const fetchStats = async () => {
    try {
      // Get current date and previous month date ranges
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const previousMonthStart = startOfMonth(subMonths(now, 1));
      const previousMonthEnd = endOfMonth(previousMonthStart);
      
      // Format dates for Supabase queries
      const currentMonthStartStr = format(currentMonthStart, "yyyy-MM-dd");
      const previousMonthStartStr = format(previousMonthStart, "yyyy-MM-dd");
      const previousMonthEndStr = format(previousMonthEnd, "yyyy-MM-dd");

      // Fetch current total users count
      const { count: totalUsersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;

      // Fetch previous month's users count (users created before the end of last month)
      const { count: previousUsersCount, error: prevUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', currentMonthStartStr);
      
      if (prevUsersError) throw prevUsersError;

      // Fetch current active subscribers
      const { count: activeSubscribersCount, error: subError } = await supabase
        .from('user_preferences')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (subError) throw subError;

      // Fetch previous month's active subscribers
      const { data: prevSubsData, error: prevSubError } = await supabase
        .from('user_preferences')
        .select('id, is_active, updated_at')
        .lt('updated_at', currentMonthStartStr);
      
      if (prevSubError) throw prevSubError;
      
      // Count active subscribers from previous month
      const previousActiveSubscribers = prevSubsData.filter(sub => sub.is_active).length;

      // Fetch current total messages sent
      const { count: messagesSentCount, error: messagesError } = await supabase
        .from('message_logs')
        .select('*', { count: 'exact', head: true });
      
      if (messagesError) throw messagesError;

      // Fetch previous month's messages sent
      const { count: previousMessagesCount, error: prevMessagesError } = await supabase
        .from('message_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', previousMonthStartStr)
        .lte('timestamp', previousMonthEndStr);
      
      if (prevMessagesError) throw prevMessagesError;

      // Fetch current categories count
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      
      if (categoriesError) throw categoriesError;

      // Fetch previous month's categories count
      const { count: previousCategoriesCount, error: prevCategoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', currentMonthStartStr);
      
      if (prevCategoriesError) throw prevCategoriesError;

      // Calculate percentage changes
      const userChange = calculatePercentChange(totalUsersCount || 0, previousUsersCount || 0);
      const subChange = calculatePercentChange(activeSubscribersCount || 0, previousActiveSubscribers);
      const msgChange = calculatePercentChange(messagesSentCount || 0, previousMessagesCount || 0);
      const catChange = calculatePercentChange(categoriesCount || 0, previousCategoriesCount || 0);

      // Update state with real data
      setStats({
        totalUsers: totalUsersCount || 0,
        activeSubscribers: activeSubscribersCount || 0,
        messagesSent: messagesSentCount || 0,
        categories: categoriesCount || 0,
        userChange,
        subChange,
        msgChange,
        catChange,
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
