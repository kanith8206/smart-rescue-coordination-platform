require('dotenv').config();
const { sendSMS } = require('./services/smsService');

const testSMS = async () => {
    console.log('--- SMS Service Test ---');
    const testNumber = process.env.TEST_PHONE_NUMBER || '+1234567890';
    console.log(`Sending test SMS to: ${testNumber}`);
    
    // Check if credentials exist
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.error('ERROR: Twilio credentials not found in .env');
        return;
    }

    try {
        const results = await sendSMS(testNumber, '🚨 Smart Rescue Coordination Platform: Test SMS Alert Service.');
        console.log('Results:', JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testSMS();
