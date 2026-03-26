// app/api/auth/mobile-login/route.ts
// Add this file to your NEXT.JS web app (urban-grail.vercel.app)
// This gives the mobile app a proper JWT login endpoint

import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne<IUser>({
      email: email.toLowerCase().trim(),
    }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isValid = await compare(password, user.password as string);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Sign a JWT with the same secret as NextAuth
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
      token,
      user: {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name,
        role: user.role || "customer",
      },
    });
  } catch (err) {
    console.error("Mobile login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
