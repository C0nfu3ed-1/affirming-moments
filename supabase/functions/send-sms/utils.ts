
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error response helper
export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Success response helper
export function successResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Handle CORS preflight requests
export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    });
  }
}

// Extract JWT token from request
export function extractJwtToken(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }
  
  const jwt = authHeader.replace('Bearer ', '');
  if (!jwt) {
    throw new Error('Invalid JWT token format');
  }
  
  return jwt;
}

// Validate environment variables
export function validateEnvironment() {
  const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
  const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
  const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Missing Twilio environment variables');
    throw new Error('Server configuration error: Missing Twilio environment variables');
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase configuration');
    throw new Error('Server configuration error: Missing Supabase configuration');
  }

  return {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  };
}

// Create Supabase client with admin key
export function createSupabaseClient(supabaseUrl: string, supabaseAnonKey: string) {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
      }
    }
  );
}

// Format phone number
export function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber.startsWith('+')) {
    return `+${phoneNumber.replace(/\D/g, '')}`;
  }
  return phoneNumber;
}
