
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, UserPlus } from 'lucide-react';

const UsersTab = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>User Management</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm">
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-5 p-3 text-sm">
                <div className="col-span-2">
                  <div className="font-medium">User Name {i}</div>
                  <div className="text-gray-500">user{i}@example.com</div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Morning, Success</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
