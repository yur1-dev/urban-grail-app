// app/api/auth/verify-otp/route.ts
// Add this file to your NEXT.JS web app
// Verifies the OTP sent during registration, then creates the account

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import { otpStore } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check OTP store
    const stored = otpStore.get(email.toLowerCase());
    if (!stored) {
      return NextResponse.json(
        { error: "OTP not found. Please request a new one." },
        { status: 400 },
      );
    }
    if (Date.now() > stored.expires) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "OTP expired. Please request a new one." },
        { status: 400 },
      );
    }
    if (stored.otp !== otp.trim()) {
      return NextResponse.json(
        { error: "Incorrect code. Try again." },
        { status: 400 },
      );
    }

    // OTP valid — create the account
    await connectDB();

    const existing = await User.findOne<IUser>({ email: email.toLowerCase() });
    if (existing) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashed = await hash(password, 12);
    const user = await User.create({
      name: stored.name,
      email: email.toLowerCase(),
      password: hashed,
      role: "customer",
    });

    // Clear OTP
    otpStore.delete(email.toLowerCase());

    // Return a JWT so the mobile app can auto-login
    const token = sign(
      {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name,
        role: user.role || "customer",
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "30d" },
    );

    return NextResponse.json({
      message: "Account created",
      token,
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name,
        role: user.role || "customer",
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
