import { sendOTPEmail } from './utils/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
    console.log('--- Email Service Test ---');
    console.log('Sending test email to:', process.env.EMAIL_USER);
    
    const result = await sendOTPEmail(process.env.EMAIL_USER, '123456');
    
    if (result.success) {
        console.log('✅ Success: Test email sent successfully!');
    } else {
        console.error('❌ Failed: Could not send test email.');
        console.error('Error Details:', result.error);
    }
    process.exit();
};

testEmail();
