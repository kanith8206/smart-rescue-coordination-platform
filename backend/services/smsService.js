const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client;

if (accountSid && accountSid.startsWith('AC') && authToken) {
  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.error('Error initializing Twilio client:', error.message);
  }
} else {
  console.warn('Twilio credentials are missing or invalid (must start with AC). SMS service will be disabled.');
}

/**
 * Send SMS to one or more recipients
 * @param {string|string[]} to - Recipient phone number or array of numbers
 * @param {string} body - The message content
 * @returns {Promise<any>}
 */
const sendSMS = async (to, body) => {
  if (!client) {
    console.warn('Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
    return { success: false, message: 'SMS service not configured' };
  }

  const recipients = Array.isArray(to) ? to : [to];
  const results = [];

  for (const recipient of recipients) {
    try {
      const message = await client.messages.create({
        body,
        from: fromPhoneNumber,
        to: recipient
      });
      console.log(`SMS sent to ${recipient}: ${message.sid}`);
      results.push({ recipient, success: true, sid: message.sid });
    } catch (error) {
      console.error(`Failed to send SMS to ${recipient}:`, error.message);
      results.push({ recipient, success: false, error: error.message });
    }
  }

  return results;
};

module.exports = {
  sendSMS
};
