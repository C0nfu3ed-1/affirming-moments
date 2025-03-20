
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAffirmationsByCategory } from '@/lib/affirmations';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewAffirmationsDialogProps {
  category: string;
}

export const ViewAffirmationsDialog = ({ category }: ViewAffirmationsDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ['affirmations', category],
    queryFn: () => getAffirmationsByCategory(category),
    enabled: open, // Only fetch when dialog is open
  });
  
  const affirmations = data?.affirmations || [];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category} Affirmations</DialogTitle>
          <DialogDescription>
            Viewing all affirmations in the {category} category.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : affirmations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No affirmations found in this category.
          </div>
        ) : (
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {affirmations.map((affirmation) => (
                <div key={affirmation.id} className="space-y-2">
                  <p className="text-sm">{affirmation.text}</p>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
