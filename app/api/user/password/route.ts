import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User, IUser } from "@/models/User";
import { compare, hash } from "bcryptjs";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword)
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 },
      );
    if (!newPassword || newPassword.length < 8)
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );

    await connectDB();
    const user = session.user as any;
    const dbUser = await User.findById<IUser>(user.id).lean();

    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isCorrect = await compare(currentPassword, dbUser.password);
    if (!isCorrect)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );

    if (currentPassword === newPassword)
      return NextResponse.json(
        { error: "New password must be different" },
        { status: 400 },
      );

    const hashed = await hash(newPassword, 12);
    await User.findByIdAndUpdate(user.id, { password: hashed }, { new: true });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
