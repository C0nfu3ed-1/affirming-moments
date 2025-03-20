
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const BulkUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsUploading(true);
      
      const lines = values.content.split('\n').filter(line => line.trim().length > 0);
      let successCount = 0;
      let errorCount = 0;
      
      for (const line of lines) {
        // Expect format: Category: Affirmation text
        const match = line.match(/^(.*?):\s*(.*)$/);
        
        if (match && match.length === 3) {
          const category = match[1].trim();
          const text = match[2].trim();
          
          if (category && text) {
            const { error } = await supabase
              .from('affirmations')
              .insert({ category, text });
              
            if (error) {
              console.error('Error inserting affirmation:', error);
              errorCount++;
            } else {
              successCount++;
            }
          } else {
            errorCount++;
          }
        } else {
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} affirmations`, {
          description: errorCount > 0 ? `${errorCount} affirmations failed to upload` : undefined
        });
        form.reset();
        setOpen(false);
      } else if (errorCount > 0) {
        toast.error(`Failed to upload affirmations`, {
          description: `Please check the format and try again.`
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred during bulk upload');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-3.5 w-3.5" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Affirmations</DialogTitle>
          <DialogDescription>
            Upload multiple affirmations at once. Each line should be in the format: 
            <code className="ml-2 bg-muted p-1 rounded">Category: Affirmation text</code>
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affirmations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Morning Motivation: Start your day with gratitude and purpose.
Confidence Boosters: I am capable of achieving anything I set my mind to.
Mindfulness & Peace: I breathe in calmness and exhale tension." 
                      {...field} 
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter one affirmation per line in the format: Category: Affirmation text
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Affirmations'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
