import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import { resetOtpStore } from "@/lib/otpStore";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getEmailHtml(otp: string): string {
  return `
    <div style="background:#0a0a0a;padding:40px;font-family:monospace;max-width:480px;margin:0 auto">
      <h1 style="color:#c9a84c;letter-spacing:8px;font-size:20px;margin:0 0 4px">
        URBAN<span style="color:#ffffff">GRAIL</span>
      </h1>
      <p style="color:#3a3a3a;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 40px">
        Est. Manila · Streetwear Culture
      </p>
      <p style="color:#ffffff;font-size:14px;margin:0 0 8px">Password Reset Request</p>
      <p style="color:#5a5a5a;font-size:13px;line-height:1.8;margin:0 0 32px">
        Use this code to reset your password.<br/>
        Expires in <strong style="color:#ffffff">10 minutes</strong>.
      </p>
      <div style="background:#111111;border:1px solid #1e1e1e;padding:32px;text-align:center;margin:0 0 32px">
        <p style="color:#c9a84c;font-size:44px;font-weight:900;letter-spacing:16px;margin:0;font-family:monospace">
          ${otp}
        </p>
      </div>
      <p style="color:#3a3a3a;font-size:11px;line-height:1.8;margin:0 0 24px">
        If you didn't request a password reset, ignore this email.<br/>
        Your password will not change.
      </p>
      <hr style="border:none;border-top:1px solid #1e1e1e;margin:0 0 20px"/>
      <p style="color:#2a2a2a;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0">
        © ${new Date().getFullYear()} Urban Grail · Manila, PH
      </p>
    </div>
  `;
}

async function sendOtpEmail(to: string, otp: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n🔑 Password reset OTP for ${to}: ${otp}\n`);
    return;
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
    to,
    subject: "Reset your Urban Grail password",
    html: getEmailHtml(otp),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, isBackup } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectDB();

    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000;

    if (isBackup) {
      const user = await User.findOne<IUser>({
        backupEmail: email.toLowerCase(),
      });
      if (!user) {
        return NextResponse.json(
          { error: "No account found with that backup email." },
          { status: 404 },
        );
      }

      resetOtpStore.set(user.email.toLowerCase(), { otp, expires });
      resetOtpStore.set(email.toLowerCase(), { otp, expires });

      await sendOtpEmail(email.toLowerCase(), otp);
      return NextResponse.json({ message: "Reset code sent" });
    }

    const user = await User.findOne<IUser>({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({
        message: "If that email exists, a code has been sent.",
      });
    }

    resetOtpStore.set(email.toLowerCase(), { otp, expires });
    await sendOtpEmail(email.toLowerCase(), otp);
    return NextResponse.json({ message: "Reset code sent" });
  } catch (err) {
    console.error("Forgot password send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
