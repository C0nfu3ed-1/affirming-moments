
import { toast } from 'sonner';
import { AdminUser } from '@/hooks/useAdminUsers';

export const exportUsersToCSV = (users: AdminUser[]): boolean => {
  try {
    // Create CSV content
    const headers = ['Name', 'Email', 'Status', 'Categories', 'Created At'];
    const csvRows = [headers];
    
    users.forEach(user => {
      csvRows.push([
        user.name,
        user.email,
        user.isActive ? 'Active' : 'Inactive',
        user.categories.join(', '),
        new Date(user.created_at).toLocaleDateString()
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Users exported successfully');
    return true;
  } catch (error) {
    console.error('Error exporting users:', error);
    toast.error('Failed to export users');
    return false;
  }
};
