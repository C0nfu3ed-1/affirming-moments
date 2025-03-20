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

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Missing Twilio environment variables');
    throw new Error('Server configuration error: Missing Twilio environment variables');
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

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

// Verify admin user (and get the user ID)
async function verifyAdminUser(jwt: string, supabase: any) {
  // Verify the JWT
  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  
  if (error || !user) {
    throw new Error('Unauthorized');
  }

  // Debug: Let's print what we're querying
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
  
  // Check if profile exists and if user is admin or sending to self
  if (!profile) {
    console.error('No profile found for user after maybeSingle:', user.id);
    throw new Error(`User profile not found after maybeSingle for ID: ${user.id}`);
  }
  
  const isAdmin = profile.is_admin || false;
  return { userId: user.id, isAdmin };
}

// Send SMS via Twilio
async function sendTwilioSMS(phoneNumber: string, message: string, twilioConfig: any) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = twilioConfig;

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
async function logMessageToDb(supabase: any, userId: string, affirmationId: string, phoneNumber: string, message: string, twilioSid: string) {
  const { error: logError } = await supabase
    .from('message_logs')
    .insert({
      user_id: userId,
      affirmation_id: affirmationId,
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

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Validate environment variables
    const envVars = validateEnvironment();
    
    // Create Supabase client (with persistSession: false)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        auth: {
          persistSession: false,
        }
      }
    );
    
    // Parse request body
    const { userId, affirmationId } = await req.json();
    
    // Validate request data
    if (!userId || !affirmationId) {
      return errorResponse('User ID and affirmation ID are required');
    }
    
    // Extract JWT token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse('Missing Authorization header', 401);
    }
    
    const jwt = authHeader.replace('Bearer ', '');
    
    // Verify admin user
    const { userId: adminId, isAdmin } = await verifyAdminUser(jwt, supabase);
    
    // Only admins can send to other users
    if (!isAdmin && userId !== adminId) {
      return errorResponse('Only administrators can send affirmations to other users', 403);
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return errorResponse(`Failed to fetch user profile: ${profileError.message}`, 500);
    }

    if (!profile || !profile.phone) {
      console.error('User profile not found or phone number missing');
      return errorResponse('User profile not found or phone number missing', 404);
    }

    // Fetch affirmation
    const { data: affirmation, error: affirmationError } = await supabase
      .from('affirmations')
      .select('text')
      .eq('id', affirmationId)
      .single();

    if (affirmationError) {
      console.error('Error fetching affirmation:', affirmationError);
      return errorResponse(`Failed to fetch affirmation: ${affirmationError.message}`, 500);
    }

    if (!affirmation || !affirmation.text) {
      console.error('Affirmation not found');
      return errorResponse('Affirmation not found', 404);
    }

    const phoneNumber = profile.phone;
    const message = affirmation.text;

    // Send SMS via Twilio
    const twilioData = await sendTwilioSMS(phoneNumber, message, {
      TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: envVars.TWILIO_PHONE_NUMBER
    });

    // Log the message
    await logMessageToDb(supabase, userId, affirmationId, phoneNumber, message, twilioData.sid);
    
    return successResponse({
      success: true,
      message: 'Affirmation sent successfully'
    });
  } catch (error) {
    console.error('Error sending affirmation:', error);
    return errorResponse(`Server error: ${error.message}`, 500);
  }
});
