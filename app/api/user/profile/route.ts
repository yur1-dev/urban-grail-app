import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { verify } from "jsonwebtoken";

function getUserFromBearer(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "customer",
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    let user = getUserFromBearer(req);

    if (!user) {
      const session = await auth();
      if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      user = session.user as any;
    }

    await connectDB();
    const dbUser = await User.findById(user.id).select("-password");
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role || "customer",
      backupEmail: dbUser.backupEmail || "",
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    let user = getUserFromBearer(req);

    if (!user) {
      const session = await auth();
      if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      user = session.user as any;
    }

    const { name, email, backupEmail } = await req.json();

    await connectDB();

    const updates: Record<string, string> = {};

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

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user.id },
      });
      if (existing)
        return NextResponse.json(
          { error: "Email is already in use by another account." },
          { status: 409 },
        );
      updates.email = normalizedEmail;
    }

    if (backupEmail !== undefined) {
      if (backupEmail.trim() === "") {
        updates.backupEmail = "";
      } else {
        const normalizedBackup = backupEmail.trim().toLowerCase();
        const currentUser = await User.findById(user.id);
        if (normalizedBackup === currentUser?.email)
          return NextResponse.json(
            { error: "Backup email cannot be the same as your login email." },
            { status: 400 },
          );
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
