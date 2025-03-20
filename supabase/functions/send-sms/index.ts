
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
  console.log('SMS Edge Function called');
  
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

  try {
    // Get the Supabase URL and key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('Supabase URL and key available:', !!supabaseUrl && !!supabaseAnonKey);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return errorResponse('Missing Supabase configuration', 500);
    }

    // Get the Authorization header
    const authorization = req.headers.get('Authorization');
    console.log('Authorization header present:', !!authorization);
    
    if (!authorization) {
      return errorResponse('Missing authorization header', 401);
    }

    // Create a client with the JWT token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorization
        }
      }
    });

    // Parse request body
    const { phoneNumber, message } = await req.json();

    // Validate request data
    if (!phoneNumber || !message) {
      return errorResponse('Phone number and message are required');
    }

    // Verify the user is authenticated
    console.log('Verifying user authentication...');
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      return errorResponse(`Authentication error: ${authError.message}`, 401);
    }
    
    if (!userData?.user) {
      console.error('No user data found');
      return errorResponse('Unauthorized: No user found', 401);
    }
    
    console.log('User authenticated:', userData.user.id);

    // Verify the user is an admin
    console.log('Checking admin status...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userData.user.id)
      .single();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      return errorResponse(`Profile check error: ${profileError.message}`, 403);
    }
    
    if (!profile || !profile.is_admin) {
      console.error('User not admin:', userData.user.id);
      return errorResponse('Only administrators can send test messages', 403);
    }
    
    console.log('Admin status verified for user:', userData.user.id);

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
        user_id: userData.user.id,
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
