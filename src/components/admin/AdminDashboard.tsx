
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Users, 
  FileText, 
  UserPlus, 
  BookOpen, 
  Download
} from 'lucide-react';
import OverviewTab from './dashboard/OverviewTab';
import UsersTab from './dashboard/UsersTab';
import ContentTab from './dashboard/ContentTab';
import LogsTab from './dashboard/LogsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button className="bg-primary-600 hover:bg-primary-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 dark:data-[state=active]:bg-primary-900 dark:data-[state=active]:text-primary-300">
            <BarChart className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 dark:data-[state=active]:bg-primary-900 dark:data-[state=active]:text-primary-300">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 dark:data-[state=active]:bg-primary-900 dark:data-[state=active]:text-primary-300">
            <BookOpen className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 dark:data-[state=active]:bg-primary-900 dark:data-[state=active]:text-primary-300">
            <FileText className="mr-2 h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersTab />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentTab />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <LogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
