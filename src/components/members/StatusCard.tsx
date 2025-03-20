
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatusCard = () => {
  return (
    <Card className="mb-8 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mr-4">
            <Check className="w-5 h-5 text-green-700 dark:text-green-300" />
          </div>
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300">Subscription Active</h3>
            <p className="text-sm text-green-600 dark:text-green-400">You're all set to receive daily affirmations!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
