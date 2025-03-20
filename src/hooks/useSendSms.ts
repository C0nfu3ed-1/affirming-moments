import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useSendSms = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send a test SMS - only available to admin users
   */
  const sendSms = async (phoneNumber: string, message: string) => {
    setIsLoading(true);
    
    try {
      // Get the current session to ensure we have a valid token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!sessionData.session) {
        console.error('No session found');
        throw new Error('You must be logged in to send messages');
      }

      // Extract the JWT token
      const jwt = sessionData.session.access_token;
      console.log('JWT token available:', !!jwt);
      
      // Call the Edge Function with proper JWT token in headers
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { phoneNumber, message },
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to send SMS');
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
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error('You must be logged in to send affirmations');
      }
      
      // Extract the JWT token
      const jwt = sessionData.session.access_token;
      
      // Get user profile to check if admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (profileError || !profile) {
        throw new Error('Unable to verify permissions');
      }
      
      // Only allow admins to send affirmations manually
      if (!profile.is_admin) {
        throw new Error('Only administrators can send affirmations manually');
      }
      
      const { error } = await supabase.functions.invoke('send-affirmation', {
        body: { userId, affirmationId },
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send affirmation');
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
