
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => {
  const isPositive = change.startsWith('+');
  const isNeutral = change === '0%';
  
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <span 
            className={`text-xs font-medium ${
              isNeutral 
                ? 'text-gray-500' 
                : isPositive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {change} from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
