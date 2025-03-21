
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminUser } from '@/hooks/useAdminUsers';

// List of available categories matching those in CategorySelection component
export const availableCategories = [
  { id: 'morning', name: 'Morning Motivation' },
  { id: 'confidence', name: 'Confidence Boosters' },
  { id: 'gratitude', name: 'Gratitude & Appreciation' },
  { id: 'success', name: 'Success Mindset' },
  { id: 'mindfulness', name: 'Mindfulness & Peace' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'relationships', name: 'Relationship Happiness' },
  { id: 'career', name: 'Career & Purpose' },
];

// Form validation schema
const editUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  isActive: z.boolean(),
  categories: z.array(z.string())
});

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface EditUserModalProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, values: {
    name: string;
    email: string;
    isActive: boolean;
    categories: string[];
  }) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  open,
  onOpenChange,
  onSubmit
}) => {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      isActive: false,
      categories: []
    }
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        categories: user.categories || []
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: EditUserFormValues) => {
    if (user) {
      await onSubmit(user.id, {
        name: values.name,
        email: values.email,
        isActive: values.isActive,
        categories: values.categories
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and preferences
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Categories</FormLabel>
              <div className="mt-2 grid grid-cols-1 gap-2 border rounded-md p-3">
                {availableCategories.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                const updatedCategories = checked
                                  ? [...field.value, category.id]
                                  : field.value?.filter(
                                      (value) => value !== category.id
                                    );
                                field.onChange(updatedCategories);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
