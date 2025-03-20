
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, SendIcon } from 'lucide-react';
import { useSendSms } from '@/hooks/useSendSms';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SendTestSms = () => {
  const { user } = useAuth();
  const { sendSms, isLoading } = useSendSms();
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [message, setMessage] = useState('This is a test affirmation message from Affirming Me Today!');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        setIsAdmin(data.is_admin);
      }
    };
    
    checkAdmin();
  }, [user]);

  // If user is not an admin, don't render this component
  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !message) {
      return;
    }
    
    await sendSms(phoneNumber, message);
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <SendIcon className="w-5 h-5 mr-2" />
          <span>Test SMS Delivery (Admin Only)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Format: +1XXXXXXXXXX (include country code)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your test message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            disabled={isLoading || !phoneNumber || !message}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <SendIcon className="mr-2 h-4 w-4" />
                Send Test Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendTestSms;
