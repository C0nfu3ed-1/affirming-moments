
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import SendTestSms from '../SendTestSms';

const ContentTab = () => {
  return (
    <div className="space-y-6">
      {/* Test SMS Card */}
      <SendTestSms />
      
      {/* Content Management Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Content Management</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-3.5 w-3.5" />
                Bulk Upload
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Affirmation
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Morning Motivation', 'Confidence Boosters', 'Gratitude & Appreciation', 'Success Mindset', 'Mindfulness & Peace', 'Health & Wellness'].map((category) => (
              <Card key={category} className="border border-gray-200 dark:border-gray-800">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-500 mb-3">
                    {Math.floor(Math.random() * 20) + 10} affirmations
                  </p>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
