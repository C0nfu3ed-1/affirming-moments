
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shuffle } from 'lucide-react';

const timeFrames = [
  { id: 'morning', name: 'Morning (6AM - 9AM)' },
  { id: 'midday', name: 'Midday (11AM - 1PM)' },
  { id: 'afternoon', name: 'Afternoon (3PM - 5PM)' },
  { id: 'evening', name: 'Evening (7PM - 9PM)' },
  { id: 'random', name: 'Random Time Each Day' },
];

interface TimeSelectionProps {
  onChange: (time: string) => void;
  selectedTime: string;
}

const TimeSelection = ({ onChange, selectedTime: propSelectedTime = '' }: TimeSelectionProps) => {
  const [selectedTime, setSelectedTime] = useState<string>(propSelectedTime || timeFrames[0].id);
  
  useEffect(() => {
    if (propSelectedTime) {
      setSelectedTime(propSelectedTime);
    }
  }, [propSelectedTime]);
  
  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    onChange(value);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        When would you like to receive your daily affirmation?
      </p>

      <RadioGroup 
        value={selectedTime} 
        onValueChange={handleTimeChange}
        className="space-y-3"
      >
        {timeFrames.map((time) => (
          <div 
            key={time.id}
            className={`
              flex items-center p-3 rounded-lg border transition-all duration-200
              ${selectedTime === time.id
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
            `}
          >
            <RadioGroupItem value={time.id} id={`time-${time.id}`} className="mr-3" />
            <Label 
              htmlFor={`time-${time.id}`} 
              className="flex items-center cursor-pointer flex-1"
            >
              {time.id === 'random' && (
                <Shuffle className="w-4 h-4 mr-2 text-primary-500" />
              )}
              {time.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        All times are in your local timezone. You can change this setting anytime.
      </p>
    </div>
  );
};

export default TimeSelection;
