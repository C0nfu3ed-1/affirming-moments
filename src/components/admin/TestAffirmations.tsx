
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSendSms } from '@/hooks/useSendSms';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ZapIcon, UserIcon } from 'lucide-react';

type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

type Affirmation = {
  id: string;
  text: string;
  category: string;
};

const TestAffirmations = () => {
  const { sendAffirmation, isLoading } = useSendSms();
  const [users, setUsers] = useState<User[]>([]);
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedAffirmation, setSelectedAffirmation] = useState<string>('');
  const [fetchingData, setFetchingData] = useState(true);

  // Fetch users and affirmations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, name, phone, email')
          .order('name', { ascending: true });

        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch affirmations
        const { data: affirmationsData, error: affirmationsError } = await supabase
          .from('affirmations')
          .select('id, text, category')
          .order('category');

        if (affirmationsError) throw affirmationsError;
        setAffirmations(affirmationsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSendAffirmation = async () => {
    if (!selectedUser || !selectedAffirmation) return;
    
    await sendAffirmation(selectedUser, selectedAffirmation);
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <ZapIcon className="w-5 h-5 mr-2" />
          <span>Test Affirmations (Admin Only)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fetchingData ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAffirmation();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="user">Select User</Label>
              <Select 
                value={selectedUser} 
                onValueChange={setSelectedUser}
              >
                <SelectTrigger id="user" className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="affirmation">Select Affirmation</Label>
              <Select 
                value={selectedAffirmation} 
                onValueChange={setSelectedAffirmation}
              >
                <SelectTrigger id="affirmation" className="w-full">
                  <SelectValue placeholder="Select an affirmation" />
                </SelectTrigger>
                <SelectContent>
                  {affirmations.map((affirmation) => (
                    <SelectItem key={affirmation.id} value={affirmation.id}>
                      <div className="truncate max-w-[300px]" title={affirmation.text}>
                        <span className="font-semibold">[{affirmation.category}]</span> {affirmation.text.substring(0, 50)}
                        {affirmation.text.length > 50 ? '...' : ''}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading || !selectedUser || !selectedAffirmation}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ZapIcon className="mr-2 h-4 w-4" />
                  Send Test Affirmation
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default TestAffirmations;
