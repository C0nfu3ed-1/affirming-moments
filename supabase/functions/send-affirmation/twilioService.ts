
// Send SMS via Twilio
export async function sendTwilioSMS(phoneNumber: string, message: string, twilioConfig: any) {
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
