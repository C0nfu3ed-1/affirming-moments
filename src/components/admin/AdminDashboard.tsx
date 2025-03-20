
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Users, 
  FileText, 
  UserPlus, 
  Clock, 
  BookOpen, 
  Upload,
  Download,
  Plus,
  Zap
} from 'lucide-react';
import TestAffirmations from './TestAffirmations';

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Users" value="254" icon={<Users className="h-5 w-5" />} change="+12%" />
            <StatCard title="Active Subscribers" value="198" icon={<Users className="h-5 w-5" />} change="+5%" />
            <StatCard title="Messages Sent" value="1,423" icon={<FileText className="h-5 w-5" />} change="+18%" />
            <StatCard title="Categories" value="8" icon={<BookOpen className="h-5 w-5" />} change="0%" />
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {/* Test Affirmations Card */}
          <TestAffirmations />
          
          {/* Content Management Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Content Management</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    Bulk Upload
                  </Button>
                  <Button size="sm">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Add Affirmation
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Morning Motivation', 'Confidence Boosters', 'Gratitude & Appreciation', 'Success Mindset', 'Mindfulness & Peace', 'Health & Wellness'].map((category) => (
                  <Card key={category} className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-500 mb-3">
                        {Math.floor(Math.random() * 20) + 10} affirmations
                      </p>
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="grid grid-cols-4 border-b bg-muted/50 p-2 text-sm font-medium">
                  <div>Timestamp</div>
                  <div>Type</div>
                  <div className="col-span-2">Message</div>
                </div>
                <div className="divide-y max-h-96 overflow-auto">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 p-2 text-sm items-center">
                      <div className="text-gray-500">
                        {new Date(Date.now() - i * 3600000).toLocaleString()}
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          i % 3 === 0 
                            ? 'bg-red-100 text-red-800' 
                            : i % 3 === 1 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {i % 3 === 0 ? 'Error' : i % 3 === 1 ? 'Warning' : 'Info'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        {i % 3 === 0 
                          ? `Failed to send SMS to +1234567${i}90: Invalid phone number` 
                          : i % 3 === 1 
                          ? `Retrying message delivery to user${i}@example.com` 
                          : `Successfully sent daily affirmation to ${10 - i} users`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard = ({ title, value, icon, change }: { title: string; value: string; icon: React.ReactNode; change: string }) => {
  const isPositive = change.startsWith('+');
  const isNeutral = change === '0%';
  
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <span 
            className={`text-xs font-medium ${
              isNeutral 
                ? 'text-gray-500' 
                : isPositive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {change} from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
