
import { 
  corsHeaders, 
  handleCors, 
  errorResponse, 
  successResponse, 
  validateEnvironment, 
  createSupabaseClient, 
  extractJwtToken,
  formatPhoneNumber
} from './utils.ts';
import { verifyAdminUser } from './auth.ts';
import { sendTwilioSMS } from './twilioService.ts';
import { logMessageToDb } from './dbService.ts';

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
