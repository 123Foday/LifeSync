import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./models/userModel.js";
import { sendOTPEmail } from "./utils/emailService.js";
import connectDB from "./config/mongodb.js";

dotenv.config();

const run = async () => {
  console.log("--- Starting Production Verification & Cleanup ---");
  
  // 1. Connect to Database
  await connectDB();

  // 2. Remove Unverified Accounts
  console.log("\n--- Cleanup: Removing Unverified Accounts ---");
  try {
    const result = await userModel.deleteMany({ is_verified: false });
    console.log(`✅ Cleanup Complete. Removed ${result.deletedCount} unverified accounts.`);
  } catch (error) {
    console.error("❌ Cleanup Failed:", error);
  }

  // 3. Verify Gmail SMTP Service
  console.log("\n--- Verification: Testing Gmail SMTP Service ---");
  const testEmail = "adaudabangura@gmail.com"; // Using the email from previous test files
  console.log(`Attempting to send test email to: ${testEmail}`);
  
  try {
    const emailResult = await sendOTPEmail(testEmail, "TEST-123");
    if (emailResult.success) {
      console.log("✅ SMTP Verification Success: Test email sent successfully!");
    } else {
      console.error("❌ SMTP Verification Failed:", emailResult.error);
    }
  } catch (emailError) {
    console.error("❌ SMTP Verification Exception:", emailError);
  }

  // 4. Disconnect
  console.log("\n--- Task Completed ---");
  await mongoose.disconnect();
  process.exit(0);
};

run();
