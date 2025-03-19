
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the actual values from Supabase integration instead of env variables
const supabaseUrl = 'https://poovixtfdbtmgkiehyea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb3ZpeHRmZGJ0bWdraWVoeWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDc3MDMsImV4cCI6MjA1Nzk4MzcwM30.rErrPOZSsIALc8-QGmijR73baUfxy8MKNym-v5HzbU0';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('affirmations').select('count');
    if (error) throw error;
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};
