
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useSendSms = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendSms = async (phoneNumber: string, message: string) => {
    setIsLoading(true);
    
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        throw new Error('You must be logged in to send messages');
      }
      
      const response = await supabase.functions.invoke('send-sms', {
        body: { phoneNumber, message },
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to send SMS');
      }
      
      toast.success('Message sent successfully!');
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error(error.message || 'Failed to send SMS');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendAffirmation = async (userId: string, affirmationId: string) => {
    setIsLoading(true);
    
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        throw new Error('You must be logged in to send affirmations');
      }
      
      const response = await supabase.functions.invoke('send-affirmation', {
        body: { userId, affirmationId },
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to send affirmation');
      }
      
      toast.success('Affirmation sent successfully!');
      return true;
    } catch (error) {
      console.error('Error sending affirmation:', error);
      toast.error(error.message || 'Failed to send affirmation');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendSms,
    sendAffirmation,
    isLoading
  };
};
