
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

  try {
    // Parse request body
    const { userId, affirmationId } = await req.json();

    // Validate request data
    if (!userId || !affirmationId) {
      return errorResponse('User ID and affirmation ID are required');
    }

    // Check if user has permission (either admin or sending to self)
    const isAdmin = user.app_metadata?.is_admin || false;
    if (!isAdmin && userId !== user.id) {
      return errorResponse('Unauthorized to send affirmations to this user', 403);
    }

    // Get user profile and preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('phone, name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      return errorResponse('User profile not found', 404);
    }

    // Get the affirmation text
    const { data: affirmation, error: affirmationError } = await supabase
      .from('affirmations')
      .select('text, category')
      .eq('id', affirmationId)
      .single();

    if (affirmationError || !affirmation) {
      console.error('Error fetching affirmation:', affirmationError);
      return errorResponse('Affirmation not found', 404);
    }

    // Format the message
    const message = `Hi ${profile.name}, here's your affirmation for today: "${affirmation.text}"`;

    // Format phone number if needed
    let formattedPhoneNumber = profile.phone;
    if (!profile.phone.startsWith('+')) {
      formattedPhoneNumber = `+${profile.phone.replace(/\D/g, '')}`;
    }

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
      
      // Log the failed message
      await supabase
        .from('message_logs')
        .insert({
          user_id: userId,
          affirmation_id: affirmationId,
          status: 'failed',
          details: JSON.stringify({
            error: twilioData.message || 'Unknown error',
            code: twilioData.code
          })
        });
        
      return errorResponse(`Twilio error: ${twilioData.message || 'Unknown error'}`, 500);
    }

    // Log the successful message
    const { error: logError } = await supabase
      .from('message_logs')
      .insert({
        user_id: userId,
        affirmation_id: affirmationId,
        status: 'sent',
        details: JSON.stringify({
          to: formattedPhoneNumber,
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
      message: 'Affirmation sent successfully',
    });
  } catch (error) {
    console.error('Error sending affirmation:', error);
    return errorResponse(`Server error: ${error.message}`, 500);
  }
});
