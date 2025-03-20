
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DonationCardProps {
  onDonate: () => void;
}

const DonationCard = ({ onDonate }: DonationCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-0 shadow-lg mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-xl font-semibold mb-2">Support Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Your donation helps us provide affirmations to those who need them most
              but can't afford it. Every contribution makes a difference.
            </p>
          </div>
          <Button 
            onClick={onDonate}
            className="flex items-center px-6 py-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Donate via PayPal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationCard;
