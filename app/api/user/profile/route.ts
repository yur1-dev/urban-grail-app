import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = session.user as any;
    const dbUser = await User.findById(user.id).select("-password");
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: dbUser.name,
      email: dbUser.email,
      backupEmail: dbUser.backupEmail || "",
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, backupEmail } = await req.json();
    const user = session.user as any;

    await connectDB();

    const updates: Record<string, string> = {};

    // Name validation
    if (name !== undefined) {
      if (!name?.trim())
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 },
        );
      if (name.trim().length < 3)
        return NextResponse.json({ error: "Name too short" }, { status: 400 });
      updates.name = name.trim();
    }

    // Email change — check if already taken
    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user.id }, // exclude current user
      });
      if (existing)
        return NextResponse.json(
          { error: "Email is already in use by another account." },
          { status: 409 },
        );
      updates.email = normalizedEmail;
    }

    // Backup email — check if already taken
    if (backupEmail !== undefined) {
      if (backupEmail.trim() === "") {
        updates.backupEmail = "";
      } else {
        const normalizedBackup = backupEmail.trim().toLowerCase();

        // Can't be the same as login email
        const currentUser = await User.findById(user.id);
        if (normalizedBackup === currentUser?.email)
          return NextResponse.json(
            { error: "Backup email cannot be the same as your login email." },
            { status: 400 },
          );

        // Can't be used by another account
        const existing = await User.findOne({
          $or: [{ email: normalizedBackup }, { backupEmail: normalizedBackup }],
          _id: { $ne: user.id },
        });
        if (existing)
          return NextResponse.json(
            { error: "That email is already in use by another account." },
            { status: 409 },
          );

        updates.backupEmail = normalizedBackup;
      }
    }

    await User.findByIdAndUpdate(user.id, updates, { new: true });

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
