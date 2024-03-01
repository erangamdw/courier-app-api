import mongoose, { Document, Schema } from "mongoose";
import jwt, { Secret } from "jsonwebtoken";

export interface OTPDocument extends Document {
  otpCode: string;
  userId: string;
  token: string;
  expiry: Date;
}

const otpSchema = new mongoose.Schema({
  otpCode: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  userId: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  token: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  expiry: {
    type: Schema.Types.Date,
    expires: 120,
  },
});

const OTPSchema = mongoose.model<OTPDocument>("OTP", otpSchema);

export default OTPSchema;
