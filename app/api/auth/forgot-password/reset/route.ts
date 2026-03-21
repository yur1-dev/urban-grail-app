import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { resetOtpStore } from "../send/route";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Re-verify OTP one final time
    const stored = resetOtpStore.get(email.toLowerCase());
    if (!stored)
      return NextResponse.json(
        { error: "Session expired. Start over." },
        { status: 400 },
      );
    if (Date.now() > stored.expires) {
      resetOtpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "OTP expired. Start over." },
        { status: 400 },
      );
    }
    if (stored.otp !== otp)
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });

    await connectDB();
    const hashed = await hash(newPassword, 12);
    const result = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashed },
    );

    if (!result)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Clear OTP after successful reset
    resetOtpStore.delete(email.toLowerCase());

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
