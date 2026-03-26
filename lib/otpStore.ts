export interface OtpEntry {
  otp: string;
  expires: number;
}

export interface RegisterOtpEntry {
  otp: string;
  expires: number;
  name: string;
}

export const resetOtpStore = new Map<string, OtpEntry>();
export const otpStore = new Map<string, RegisterOtpEntry>();
