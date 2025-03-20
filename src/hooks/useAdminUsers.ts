
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchAllUsers, 
  createUser, 
  updateUserDetails, 
  deleteUserById,
  exportUsersToCSV
} from '@/lib/userService';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  categories: string[];
  created_at: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const userData = await fetchAllUsers();
    if (userData) {
      setUsers(userData);
    }
    setLoading(false);
  }, []);

  const addUser = async (name: string, email: string, phone: string, isActive: boolean = true) => {
    const result = await createUser({
      name,
      email,
      phone,
      isActive
    });
    
    if (result) {
      await fetchUsers(); // Refresh the user list
      return { success: true };
    }
    return { success: false };
  };
  
  const updateUser = async (id: string, data: {
    name?: string;
    email?: string;
    isActive?: boolean;
    categories?: string[];
  }) => {
    const success = await updateUserDetails(id, data);
    if (success) {
      await fetchUsers(); // Refresh the user list
    }
    return success;
  };
  
  const deleteUser = async (id: string) => {
    const success = await deleteUserById(id);
    if (success) {
      await fetchUsers(); // Refresh the user list
    }
    return success;
  };

  const exportUsers = () => {
    return exportUsersToCSV(users);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    exportUsers
  };
};
