
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    });
  }
};

// Error response helper
const errorResponse = (message: string, status = 400) => {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

// Success response helper
const successResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get environment variables
  const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
  const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
  const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

  // Check if all required env vars are set
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Missing Twilio environment variables');
    return errorResponse('Server configuration error', 500);
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Get the JWT token from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error('No Authorization header found');
    return errorResponse('Missing authorization header', 401);
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  // Verify the user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Authentication error:', userError);
    return errorResponse('Unauthorized', 401);
  }

  // Verify the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
    
  if (profileError || !profile) {
    console.error('Profile check error:', profileError);
    return errorResponse('Unable to verify permissions', 403);
  }
  
  if (!profile.is_admin) {
    console.error('User not admin:', user.id);
    return errorResponse('Only administrators can send test messages', 403);
  }

  try {
    // Parse request body
    const { phoneNumber, message } = await req.json();

    // Validate request data
    if (!phoneNumber || !message) {
      return errorResponse('Phone number and message are required');
    }

    // Format phone number if needed
    let formattedPhoneNumber = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;
    }

    console.log(`Sending SMS to ${formattedPhoneNumber} with message: ${message.substring(0, 30)}...`);

    // Construct the Twilio API URL
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    // Create the form data for the Twilio request
    const formData = new URLSearchParams();
    formData.append('To', formattedPhoneNumber);
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
      return errorResponse(`Twilio error: ${twilioData.message || 'Unknown error'}`, 500);
    }

    // Log the successful message
    console.log('SMS sent successfully:', twilioData.sid);

    // Store the message in the message_logs table
    const { error: logError } = await supabase
      .from('message_logs')
      .insert({
        user_id: user.id,
        affirmation_id: 'manual-send', // For manual sends
        status: 'sent',
        details: JSON.stringify({
          to: formattedPhoneNumber,
          body: message,
          twilio_sid: twilioData.sid
        })
      });

    if (logError) {
      console.error('Error logging message:', logError);
      // We continue even if logging fails
    }

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
