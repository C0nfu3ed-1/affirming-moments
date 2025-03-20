
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
      
      if (!session?.access_token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
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
      // Check if JWT token is available and logged
      const { data: { session } } = await supabase.auth.getSession();
      console.log('JWT token available for affirmation send:', !!session?.access_token);
      
      if (!session?.access_token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Log the user ID from the session vs. the passed userId parameter
      console.log('Current user ID from session:', session.user?.id);
      console.log('User ID parameter being sent to edge function:', userId);
      
      // Check if they match or if we're sending for a different user (admin feature)
      if (session.user?.id !== userId) {
        console.log('Note: Sending affirmation for a different user than the current user (admin feature)');
      }
      
      // Call the Edge Function with additional logging
      console.log('Sending affirmation request with userId:', userId, 'and affirmationId:', affirmationId);
      const { data, error } = await supabase.functions.invoke('send-affirmation', {
        body: { userId, affirmationId }
      });

      if (error) {
        console.error('Supabase edge function error:', error);
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
