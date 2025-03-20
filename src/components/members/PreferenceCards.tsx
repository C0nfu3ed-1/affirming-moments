
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategorySelection from './CategorySelection';
import TimeSelection from './TimeSelection';

interface PreferenceCardsProps {
  selectedCategories: string[];
  selectedTime: string;
  onCategoryChange: (categories: string[]) => void;
  onTimeChange: (time: string) => void;
}

const PreferenceCards = ({
  selectedCategories,
  selectedTime,
  onCategoryChange,
  onTimeChange
}: PreferenceCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Category Selection */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="mr-2">Affirmation Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategorySelection
            onChange={onCategoryChange}
            selectedCategories={selectedCategories}
          />
        </CardContent>
      </Card>
      
      {/* Time Selection */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>Delivery Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimeSelection
            onChange={onTimeChange}
            selectedTime={selectedTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferenceCards;
