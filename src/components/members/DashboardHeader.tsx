
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onCancelSubscription: () => void;
}

const DashboardHeader = ({ onCancelSubscription }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Your Affirmation Dashboard</h1>
      <Button 
        variant="outline" 
        className="border-red-300 hover:border-red-500 text-red-600 hover:bg-red-50"
        onClick={onCancelSubscription}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Cancel Subscription
      </Button>
    </div>
  );
};

export default DashboardHeader;
