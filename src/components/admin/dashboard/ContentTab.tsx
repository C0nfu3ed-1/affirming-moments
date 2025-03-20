
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories } from '@/lib/affirmations';
import { AddAffirmationDialog } from '../AddAffirmationDialog';
import { BulkUploadDialog } from '../BulkUploadDialog';
import { ViewAffirmationsDialog } from '../ViewAffirmationsDialog';
import { EditAffirmationsDialog } from '../EditAffirmationsDialog';
import SendTestSms from '../SendTestSms';

const ContentTab = () => {
  // Fetch categories
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  
  const categories = data?.categories || [];
  
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
              <BulkUploadDialog />
              <AddAffirmationDialog />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="border border-gray-200 dark:border-gray-800">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-500 mb-3">
                      {category.description}
                    </p>
                    <div className="flex justify-between">
                      <ViewAffirmationsDialog category={category.name} />
                      <EditAffirmationsDialog category={category.name} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
