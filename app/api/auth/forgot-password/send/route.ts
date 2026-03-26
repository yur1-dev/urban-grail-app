// app/api/auth/send-otp/route.ts
// Replaces your existing send-otp route
// Stores OTP in MongoDB so verify-otp can read it (fixes Vercel serverless issue)

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import { OtpVerification } from "@/models/OtpVerification";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if email already has a full account
    const existing = await User.findOne<IUser>({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert — replace any existing pending OTP for this email
    await OtpVerification.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        email: email.toLowerCase(),
        otp,
        name: name.trim(),
        expires,
      },
      { upsert: true, new: true },
    );

    // Log OTP in terminal if no email config (dev mode)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`\n🔑 OTP for ${email}: ${otp}\n`);
      return NextResponse.json({ message: "OTP sent (check terminal)" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
      },
    });

    await transporter.sendMail({
      from: `"Urban Grail" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Urban Grail verification code",
      html: `
        <div style="background:#0a0a0a;padding:40px;font-family:monospace;max-width:480px;margin:0 auto">
          <h1 style="color:#c9a84c;letter-spacing:8px;font-size:20px;margin:0 0 4px">
            URBAN<span style="color:#ffffff">GRAIL</span>
          </h1>
          <p style="color:#3a3a3a;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 40px">
            Est. Manila · Streetwear Culture
          </p>
          <p style="color:#ffffff;font-size:14px;margin:0 0 8px">Hey ${name.trim()},</p>
          <p style="color:#5a5a5a;font-size:13px;line-height:1.8;margin:0 0 32px">
            Enter this code to verify your email and create your account.<br/>
            Code expires in <strong style="color:#ffffff">10 minutes</strong>.
          </p>
          <div style="background:#111111;border:1px solid #1e1e1e;padding:32px;text-align:center;margin:0 0 32px">
            <p style="color:#c9a84c;font-size:44px;font-weight:900;letter-spacing:16px;margin:0;font-family:monospace">
              ${otp}
            </p>
          </div>
          <p style="color:#3a3a3a;font-size:11px;line-height:1.8;margin:0 0 24px">
            If you didn't request this, you can safely ignore this email.<br/>
            Never share this code with anyone.
          </p>
          <hr style="border:none;border-top:1px solid #1e1e1e;margin:0 0 20px"/>
          <p style="color:#2a2a2a;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0">
            © ${new Date().getFullYear()} Urban Grail · Manila, PH
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { error: "Failed to send OTP. Check email config." },
      { status: 500 },
    );
  }
}
