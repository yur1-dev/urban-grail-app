// models/OtpVerification.ts
// Add this file to your Next.js web app

import { Schema, model, models, Document, Model } from "mongoose";

export interface IOtpVerification extends Document {
  email: string;
  otp: string;
  name: string;
  expires: Date;
  createdAt: Date;
}

const OtpVerificationSchema = new Schema<IOtpVerification>(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    name: { type: String, required: true },
    // TTL index — MongoDB auto-deletes the document after expiry
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

// Auto-delete expired OTPs from the database
OtpVerificationSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// One OTP per email at a time
OtpVerificationSchema.index({ email: 1 }, { unique: true });

export const OtpVerification: Model<IOtpVerification> =
  models.OtpVerification ||
  model<IOtpVerification>("OtpVerification", OtpVerificationSchema);
