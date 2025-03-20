
import { 
  corsHeaders, 
  handleCors, 
  errorResponse, 
  successResponse, 
  validateEnvironment, 
  createSupabaseClient,
  extractJwtToken
} from './utils.ts';
import { verifyAdminUser } from './auth.ts';
import { sendTwilioSMS } from './twilioService.ts';
import { logMessageToDb } from './dbService.ts';

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Validate environment variables
    const envVars = validateEnvironment();
    
    // Create Supabase client
    const supabase = createSupabaseClient(
      envVars.SUPABASE_URL,
      envVars.SUPABASE_ANON_KEY
    );
    
    // Parse request body
    const { userId, affirmationId } = await req.json();
    
    // Validate request data
    if (!userId || !affirmationId) {
      return errorResponse('User ID and affirmation ID are required');
    }
    
    // Extract JWT token from request
    const jwt = extractJwtToken(req);
    
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
