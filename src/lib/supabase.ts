
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase client is automatically initialized with environment variables
// that are injected by Lovable during the build process
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
