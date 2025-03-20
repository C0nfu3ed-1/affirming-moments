
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client'; // Updated import

export const useSendSms = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendSms = async (phoneNumber: string, message: string) => {
    setIsLoading(true);
    
    try {
      // Check if JWT token is available
      const { data: { session } } = await supabase.auth.getSession();
      console.log('JWT token available:', !!session?.access_token);
      
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { phoneNumber, message }
      });

      if (error) {
        throw error;
      }

      toast.success('SMS sent successfully!');
      return data;
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error('Failed to send SMS', { 
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendAffirmation = async (userId: string, affirmationId: string) => {
    setIsLoading(true);
    
    try {
      // Check if JWT token is available
      const { data: { session } } = await supabase.auth.getSession();
      console.log('JWT token available:', !!session?.access_token);
      
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('send-affirmation', {
        body: { userId, affirmationId }
      });

      if (error) {
        throw error;
      }

      toast.success('Affirmation sent successfully!');
      return data;
    } catch (error) {
      console.error('Error sending affirmation:', error);
      toast.error('Failed to send affirmation', { 
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendSms, sendAffirmation, isLoading };
};
