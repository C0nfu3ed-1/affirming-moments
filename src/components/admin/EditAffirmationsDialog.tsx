
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAffirmationsByCategory, updateAffirmation, deleteAffirmation } from '@/lib/affirmations';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Save, X } from 'lucide-react';

interface EditAffirmationsDialogProps {
  category: string;
}

export const EditAffirmationsDialog = ({ category }: EditAffirmationsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [affirmationToDelete, setAffirmationToDelete] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['affirmations', category],
    queryFn: () => getAffirmationsByCategory(category),
    enabled: open, // Only fetch when dialog is open
  });
  
  const affirmations = data?.affirmations || [];
  
  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditedText(text);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedText('');
  };
  
  const handleSaveEdit = async (id: string) => {
    try {
      const { affirmation, error } = await updateAffirmation(id, editedText, category);
      
      if (error) {
        toast.error('Failed to update affirmation');
        return;
      }
      
      toast.success('Affirmation updated successfully');
      setEditingId(null);
      setEditedText('');
      queryClient.invalidateQueries({ queryKey: ['affirmations', category] });
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleDelete = async () => {
    if (!affirmationToDelete) return;
    
    try {
      const { error } = await deleteAffirmation(affirmationToDelete);
      
      if (error) {
        toast.error('Failed to delete affirmation');
        return;
      }
      
      toast.success('Affirmation deleted successfully');
      setDeleteDialogOpen(false);
      setAffirmationToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['affirmations', category] });
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };
  
  const confirmDelete = (id: string) => {
    setAffirmationToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit {category} Affirmations</DialogTitle>
            <DialogDescription>
              Modify or delete affirmations in this category.
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
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {affirmations.map((affirmation) => (
                  <Card key={affirmation.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      {editingId === affirmation.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              <X className="mr-2 h-3.5 w-3.5" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(affirmation.id)}
                            >
                              <Save className="mr-2 h-3.5 w-3.5" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm">{affirmation.text}</p>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEdit(affirmation.id, affirmation.text)}
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(affirmation.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              affirmation from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAffirmationToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
