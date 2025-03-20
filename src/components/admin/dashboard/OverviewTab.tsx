
import { Users, FileText, BookOpen } from 'lucide-react';
import StatCard from './StatCard';

const OverviewTab = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Users" value="254" icon={<Users className="h-5 w-5" />} change="+12%" />
      <StatCard title="Active Subscribers" value="198" icon={<Users className="h-5 w-5" />} change="+5%" />
      <StatCard title="Messages Sent" value="1,423" icon={<FileText className="h-5 w-5" />} change="+18%" />
      <StatCard title="Categories" value="8" icon={<BookOpen className="h-5 w-5" />} change="0%" />
    </div>
  );
};

export default OverviewTab;
