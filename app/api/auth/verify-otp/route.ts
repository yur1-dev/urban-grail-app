// app/api/auth/verify-otp/route.ts
// Reads OTP from MongoDB — works correctly across Vercel serverless instances

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import { OtpVerification } from "@/models/OtpVerification";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const stored = await OtpVerification.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!stored) {
      return NextResponse.json(
        { error: "OTP not found. Please request a new one." },
        { status: 400 },
      );
    }

    if (new Date() > stored.expires) {
      await OtpVerification.deleteOne({ email: email.toLowerCase() });
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

    const existing = await User.findOne<IUser>({ email: email.toLowerCase() });
    if (existing) {
      await OtpVerification.deleteOne({ email: email.toLowerCase() });
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashed = await hash(password, 12);
    const user = await User.create({
      name: stored.name,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: "customer",
    });

    await OtpVerification.deleteOne({ email: email.toLowerCase() });

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
