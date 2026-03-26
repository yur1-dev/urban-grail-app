import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const riders = await User.find({ role: "rider" })
      .select("_id name email createdAt")
      .lean();
    return NextResponse.json(riders);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );

    const hashed = await hash(password, 12);
    const rider = await User.create({
      name,
      email,
      password: hashed,
      role: "rider",
    });

    return NextResponse.json(
      { _id: rider._id, name: rider.name, email: rider.email },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
