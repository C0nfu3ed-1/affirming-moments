
import { Users, FileText, BookOpen } from 'lucide-react';
import StatCard from './StatCard';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Skeleton } from '@/components/ui/skeleton';

const OverviewTab = () => {
  const { 
    totalUsers, 
    activeSubscribers, 
    messagesSent, 
    categories, 
    userChange,
    subChange,
    msgChange,
    catChange,
    loading 
  } = useAdminStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <div className="h-4"></div>
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Users" 
        value={totalUsers.toString()} 
        icon={<Users className="h-5 w-5" />} 
        change={userChange} 
      />
      <StatCard 
        title="Active Subscribers" 
        value={activeSubscribers.toString()} 
        icon={<Users className="h-5 w-5" />} 
        change={subChange} 
      />
      <StatCard 
        title="Messages Sent" 
        value={messagesSent.toString()} 
        icon={<FileText className="h-5 w-5" />} 
        change={msgChange} 
      />
      <StatCard 
        title="Categories" 
        value={categories.toString()} 
        icon={<BookOpen className="h-5 w-5" />} 
        change={catChange} 
      />
    </div>
  );
};

export default OverviewTab;
