
// Log message in the database
export async function logMessageToDb(supabase: any, userId: string, phoneNumber: string, message: string, twilioSid: string) {
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
