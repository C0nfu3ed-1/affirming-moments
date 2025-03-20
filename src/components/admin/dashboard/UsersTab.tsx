import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, UserPlus } from 'lucide-react';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { Skeleton } from '@/components/ui/skeleton';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserDialog from './DeleteUserDialog';
import { toast } from 'sonner';

const UsersTab = () => {
  const { users, loading, addUser, updateUser, deleteUser, exportUsers } = useAdminUsers();
  
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  const handleAddUser = async (values: { name: string; email: string; phone: string; password: string }) => {
    const result = await addUser(values.name, values.email, values.phone, values.password);
    if (result.success) {
      setAddUserOpen(false);
      toast.success('User added successfully');
    }
  };
  
  const handleEditUser = async (id: string, values: {
    name: string;
    email: string;
    isActive: boolean;
    categories: string[];
  }) => {
    console.log('Submitting user edit with values:', values);
    const success = await updateUser(id, values);
    if (success) {
      setEditUserOpen(false);
      setSelectedUser(null);
    }
  };
  
  const handleDeleteUser = async () => {
    if (selectedUser) {
      const success = await deleteUser(selectedUser.id);
      if (success) {
        setDeleteUserOpen(false);
        setSelectedUser(null);
      }
    }
  };
  
  const handleExport = () => {
    exportUsers();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>User Management</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" onClick={() => setAddUserOpen(true)}>
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              Add User
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-5 border-b bg-muted/50 p-2 text-sm font-medium">
            <div className="col-span-2">Name/Email</div>
            <div>Status</div>
            <div>Categories</div>
            <div>Actions</div>
          </div>
          <div className="divide-y">
            {loading ? (
              Array(5).fill(null).map((_, i) => (
                <div key={i} className="grid grid-cols-5 p-3 text-sm">
                  <div className="col-span-2">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="grid grid-cols-5 p-3 text-sm">
                  <div className="col-span-2">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <div className="flex items-center">
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      {user.categories.join(', ') || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditUserOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteUserOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Add User Modal */}
      <AddUserModal
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSubmit={handleAddUser}
      />
      
      {/* Edit User Modal */}
      <EditUserModal
        user={selectedUser}
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        onSubmit={handleEditUser}
      />
      
      {/* Delete User Confirmation Dialog */}
      <DeleteUserDialog
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        userName={selectedUser?.name || ''}
        onConfirm={handleDeleteUser}
      />
    </Card>
  );
};

export default UsersTab;
