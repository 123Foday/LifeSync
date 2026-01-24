import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${email}`;
  const mailOptions = {
    from: `"LifeSync Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Complete Your Registration - LifeSync',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
        <p>Hello,</p>
        <p>Thank you for registering with LifeSync. Click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background: #007bff; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can also click the link below or copy and paste it into your browser:</p>
        <p style="word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          LifeSync Inc. | 2026. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Verification email failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"LifeSync Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification Code - LifeSync',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007bff; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          LifeSync Inc. | 2026. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: `"LifeSync Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - LifeSync',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #007bff; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          LifeSync Inc. | 2026. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Password reset email failed:', error);
    return { success: false, error: error.message };
  }
};
export const sendAccountDeletionEmail = async (email, name) => {
  const mailOptions = {
    from: `"LifeSync Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Account Deleted - LifeSync',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #d9534f; text-align: center;">Account Deactivation Confirmed</h2>
        <p>Hello ${name},</p>
        <p>This email confirms that your LifeSync account has been successfully deleted as per your request.</p>
        <p>All your personal data, appointment history, and medical records have been permanently removed from our active systems. If this was a mistake, please contact our support team immediately, though please note that data recovery may not be possible.</p>
        <div style="background: #fff5f5; padding: 15px; border-left: 4px solid #d9534f; margin: 20px 0;">
          <p style="margin: 0; color: #a94442; font-weight: bold;">Security Notice:</p>
          <p style="margin: 5px 0 0; font-size: 14px;">If you did not authorize this action, your account may have been compromised. Please contact security@lifesync.com immediately.</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">
          LifeSync Inc. | 2026. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Account deletion email failed:', error);
    return { success: false, error: error.message };
  }
};
