// app/api/auth/forgot-password/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resetOtpStore } from "../send/route";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const stored = resetOtpStore.get(email.toLowerCase());
    if (!stored)
      return NextResponse.json(
        { error: "OTP not found. Request a new one." },
        { status: 400 },
      );
    if (Date.now() > stored.expires) {
      resetOtpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "OTP expired. Request a new one." },
        { status: 400 },
      );
    }
    if (stored.otp !== otp)
      return NextResponse.json(
        { error: "Incorrect code. Try again." },
        { status: 400 },
      );

    return NextResponse.json({ message: "OTP verified" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
