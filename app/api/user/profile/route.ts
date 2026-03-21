import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();

    if (!name?.trim())
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (name.trim().length < 3)
      return NextResponse.json({ error: "Name too short" }, { status: 400 });

    await connectDB();
    const user = session.user as any;
    await User.findByIdAndUpdate(user.id, { name: name.trim() });

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
