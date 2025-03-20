
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    });
  }
}

// Error response helper
function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Success response helper
function successResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

// Validate environment variables
function validateEnvironment() {
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
function createSupabaseClient(supabaseUrl: string, supabaseAnonKey: string) {
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

// Verify JWT and get user from it
async function verifyJwtAndGetUser(jwt: string, supabase: any) {
  try {
    console.log('Verifying JWT and getting user...');
    
    // Verify the JWT
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    
    if (error) {
      console.error('JWT verification error:', error);
      throw new Error(`Authentication error: ${error.message}`);
    }
    
    if (!user) {
      console.error('No user found from JWT');
      throw new Error('Unauthorized: No user found');
    }
    
    console.log('User authenticated from JWT:', user.id);
    return user;
  } catch (error) {
    console.error('Error in verifyJwtAndGetUser:', error);
    throw error;
  }
}

// Verify user is an admin
async function verifyAdminUser(jwt: string, supabase: any) {
  try {
    // Get user from JWT
    const user = await verifyJwtAndGetUser(jwt, supabase);
    
    // Verify the user is an admin
    console.log('Checking admin status for user:', user.id);
    
    // Debug: Let's print out what we're querying
    console.log(`Querying profiles table for id = ${user.id}`);
    
    // First, check if the profile exists at all
    const { data: allProfiles, error: countError } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .eq('id', user.id);
      
    if (countError) {
      console.error('Error fetching profiles:', countError);
      throw new Error(`Database error: ${countError.message}`);
    }
    
    console.log('Profiles matching user ID:', allProfiles);
    
    if (!allProfiles || allProfiles.length === 0) {
      console.error('No profile found for user in database:', user.id);
      throw new Error(`User profile not found in database for ID: ${user.id}`);
    }
    
    // Now get the specific profile with maybeSingle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new Error(`Profile check error: ${profileError.message}`);
    }
    
    // Check if profile exists and is admin
    if (!profile) {
      console.error('No profile found for user after maybeSingle:', user.id);
      throw new Error(`User profile not found after maybeSingle for ID: ${user.id}`);
    }
    
    if (!profile.is_admin) {
      console.error('User not admin:', user.id);
      throw new Error('Only administrators can send test messages');
    }
    
    console.log('Admin status verified for user:', user.id);
    return user.id;
  } catch (error) {
    console.error('Error in verifyAdminUser:', error);
    throw error;
  }
}

// Format phone number
function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber.startsWith('+')) {
    return `+${phoneNumber.replace(/\D/g, '')}`;
  }
  return phoneNumber;
}

// Send SMS via Twilio
async function sendTwilioSMS(phoneNumber: string, message: string, twilioConfig: any) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = twilioConfig;
  
  console.log(`Sending SMS to ${phoneNumber} with message: ${message.substring(0, 30)}...`);

  // Construct the Twilio API URL
  const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  // Create the form data for the Twilio request
  const formData = new URLSearchParams();
  formData.append('To', phoneNumber);
  formData.append('From', TWILIO_PHONE_NUMBER);
  formData.append('Body', message);

  // Send the SMS via Twilio API
  const twilioResponse = await fetch(twilioApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
    },
    body: formData.toString(),
  });

  // Parse Twilio response
  const twilioData = await twilioResponse.json();

  // Check if Twilio returned an error
  if (!twilioResponse.ok) {
    console.error('Twilio API error:', twilioData);
    throw new Error(`Twilio error: ${twilioData.message || 'Unknown error'}`);
  }

  console.log('SMS sent successfully:', twilioData.sid);
  return twilioData;
}

// Log message in the database
async function logMessageToDb(supabase: any, userId: string, phoneNumber: string, message: string, twilioSid: string) {
  const { error: logError } = await supabase
    .from('message_logs')
    .insert({
      user_id: userId,
      affirmation_id: 'manual-send', // For manual sends
      status: 'sent',
      details: JSON.stringify({
        to: phoneNumber,
        body: message,
        twilio_sid: twilioSid
      })
    });

  if (logError) {
    console.error('Error logging message:', logError);
    // We continue even if logging fails
  }
}

// Extract JWT token from request
function extractJwtToken(req: Request) {
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

// Main handler function
Deno.serve(async (req) => {
  console.log('SMS Edge Function called');
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Only accept POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Validate environment variables
    const envVars = validateEnvironment();
    
    // Extract JWT token
    const jwt = extractJwtToken(req);
    console.log('JWT token present:', !!jwt);
    
    // Create Supabase client
    const supabase = createSupabaseClient(
      envVars.SUPABASE_URL, 
      envVars.SUPABASE_ANON_KEY
    );

    // Parse request body
    const { phoneNumber, message } = await req.json();

    // Validate request data
    if (!phoneNumber || !message) {
      return errorResponse('Phone number and message are required');
    }

    // Verify admin user
    const userId = await verifyAdminUser(jwt, supabase);

    // Format phone number if needed
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Send SMS via Twilio
    const twilioData = await sendTwilioSMS(formattedPhoneNumber, message, {
      TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: envVars.TWILIO_PHONE_NUMBER
    });

    // Log the message in the database
    await logMessageToDb(supabase, userId, formattedPhoneNumber, message, twilioData.sid);

    return successResponse({
      success: true,
      messageId: twilioData.sid,
      message: 'SMS sent successfully',
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return errorResponse(`Server error: ${error.message}`, 500);
  }
});
