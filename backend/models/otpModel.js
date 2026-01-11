import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp_hash: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["verification", "password_reset", "email_change", "email_change_old", "email_change_new", "account_deletion"],
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  last_attempt: {
    type: Date,
  },
}, { timestamps: true });

// Auto-delete expired OTPs
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 10 });

const otpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);

export default otpModel;
