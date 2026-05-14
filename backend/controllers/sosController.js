const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const SOS = require('../models/SOS');

const receiveSOS = async (req, res) => {
  try {
    const { name, location, emergencyType, message, familyEmails, familyPhoneNumbers } = req.body;

    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ success: false, message: 'Location is required' });
    }

    // Save SOS to MongoDB
    const newSOS = new SOS({
      name,
      location,
      emergencyType,
      message
    });
    await newSOS.save();

    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    
    // --- Email Sending Logic ---
    const subject = `CRITICAL SOS ALERT: ${emergencyType || 'Emergency'} from ${name || 'Citizen'}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #dc2626; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🚨 CRITICAL SOS ALERT 🚨</h1>
        </div>
        <div style="padding: 20px; background-color: #fef2f2;">
          <h2 style="color: #991b1b; margin-top: 0;">Emergency Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">${name || 'Unknown Citizen'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;"><strong>Type:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">${emergencyType || 'General Emergency'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;"><strong>Message:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">${message || 'Immediate assistance requested'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;"><strong>Location:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #fca5a5;">
                <a href="${mapsLink}" style="background-color: #dc2626; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 4px;">View on Google Maps</a><br/>
                <small style="color: #6b7280;">Lat: ${location.lat}, Lng: ${location.lng}</small>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;

    const responders = [process.env.EMAIL_USER]; 
    if (familyEmails && Array.isArray(familyEmails)) {
      familyEmails.forEach(email => {
        if (email && email.includes('@')) responders.push(email);
      });
    }

    await sendEmail(responders, subject, htmlContent);

    // --- SMS dispatch (non-blocking) ---
    if (emergencyPhones && Array.isArray(emergencyPhones) && emergencyPhones.length > 0) {
      const validPhones = emergencyPhones.filter(p => p && p.startsWith('+'));
      if (validPhones.length > 0) {
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const smsBody =
          `\u{1F6A8} Emergency Alert!\n` +
          `${name || 'Someone'} needs help.\n` +
          `Location: https://maps.google.com/?q=${location.lat},${location.lng}\n` +
          `Emergency: ${emergencyType || 'General'}\n` +
          `${message ? 'Message: ' + message + '\n' : ''}` +
          `Time: ${time}\n` +
          `[HIGH PRIORITY - Smart Rescue Platform]`;

        sendSMS(validPhones, smsBody).catch(err =>
          console.error('SMS dispatch error (non-blocking):', err.message)
        );
      }
    }

    // --- SMS Alert Integration ---
    if (familyPhoneNumbers && Array.isArray(familyPhoneNumbers) && familyPhoneNumbers.length > 0) {
      const smsBody = `🚨 Emergency Alert!
${name || 'A citizen'} needs help.
Location: ${mapsLink}
Emergency: ${emergencyType || 'General'}
Time: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      await sendSMS(familyPhoneNumbers, smsBody);
    }

    return res.status(200).json({
      success: true,
      message: 'SOS sent successfully via Email and SMS'
    });

  } catch (error) {
    console.error('SOS Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending SOS'
    });
  }
};

module.exports = {
  receiveSOS
};
