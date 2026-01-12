import { sendOTPEmail } from './utils/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
    console.log('--- Email Service Test ---');
    console.log('Sending test email to: adaudabangura@gmail.com');
    
    const result = await sendOTPEmail('adaudabangura@gmail.com', '123456');
    
    if (result.success) {
        console.log('✅ Success: Test email sent successfully!');
    } else {
        console.error('❌ Failed: Could not send test email.');
        console.error('Error Details:', result.error);
    }
    process.exit();
};

testEmail();
