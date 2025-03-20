
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

  return {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
  };
}

// Create Supabase client
function createSupabaseClient(authHeader: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}

// Verify user permissions
async function verifyPermissions(supabase: any, userId: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Authentication error:', userError);
    throw new Error('Unauthorized');
  }

  // Check if user has permission (either admin or sending to self)
  const isAdmin = user.app_metadata?.is_admin || false;
  if (!isAdmin && userId !== user.id) {
    throw new Error('Unauthorized to send affirmations to this user');
  }
  
  return user.id;
}

// Get user profile
async function getUserProfile(supabase: any, userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('phone, name')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError);
    throw new Error('User profile not found');
  }
  
  return profile;
}

// Get affirmation text
async function getAffirmation(supabase: any, affirmationId: string) {
  const { data: affirmation, error: affirmationError } = await supabase
    .from('affirmations')
    .select('text, category')
    .eq('id', affirmationId)
    .single();

  if (affirmationError || !affirmation) {
    console.error('Error fetching affirmation:', affirmationError);
    throw new Error('Affirmation not found');
  }
  
  return affirmation;
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

  return twilioData;
}

// Log message to database
async function logMessage(supabase: any, userId: string, affirmationId: string, status: string, details: any) {
  const { error: logError } = await supabase
    .from('message_logs')
    .insert({
      user_id: userId,
      affirmation_id: affirmationId,
      status: status,
      details: JSON.stringify(details)
    });

  if (logError) {
    console.error('Error logging message:', logError);
    // We continue even if logging fails
  }
}

// Main handler function
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Only accept POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Get the JWT token from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Missing authorization header', 401);
  }

  // Create a Supabase client
  const supabase = createSupabaseClient(authHeader);

  try {
    // Validate environment variables
    const envVars = validateEnvironment();
    
    // Parse request body
    const { userId, affirmationId } = await req.json();

    // Validate request data
    if (!userId || !affirmationId) {
      return errorResponse('User ID and affirmation ID are required');
    }

    // Verify permissions
    await verifyPermissions(supabase, userId);

    // Get user profile and affirmation
    const profile = await getUserProfile(supabase, userId);
    const affirmation = await getAffirmation(supabase, affirmationId);

    // Format the message
    const message = `Hi ${profile.name}, here's your affirmation for today: "${affirmation.text}"`;

    // Format phone number
    const formattedPhoneNumber = formatPhoneNumber(profile.phone);

    // Send SMS via Twilio
    const twilioData = await sendTwilioSMS(formattedPhoneNumber, message, {
      TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER: envVars.TWILIO_PHONE_NUMBER
    });

    // Log the successful message
    await logMessage(supabase, userId, affirmationId, 'sent', {
      to: formattedPhoneNumber,
      twilio_sid: twilioData.sid
    });

    return successResponse({
      success: true,
      messageId: twilioData.sid,
      message: 'Affirmation sent successfully',
    });
  } catch (error) {
    console.error('Error sending affirmation:', error);
    
    // If it's a request parsing error, we won't have userId/affirmationId
    try {
      const { userId, affirmationId } = await req.json();
      
      // Log the failed message if we have user and affirmation IDs
      if (userId && affirmationId) {
        await logMessage(supabase, userId, affirmationId, 'failed', {
          error: error.message || 'Unknown error'
        });
      }
    } catch (e) {
      // Ignore errors in the error handler
    }
    
    return errorResponse(`Server error: ${error.message}`, 500);
  }
});
