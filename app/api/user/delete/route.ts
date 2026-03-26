import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verify } from "jsonwebtoken";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

function getUserFromBearer(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as any;
    return { id: decoded.id, email: decoded.email };
  } catch {
    return null;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let user = getUserFromBearer(req);
    if (!user) {
      const session = await auth();
      if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      user = session.user as any;
    }

    await connectDB();

    // Delete all orders belonging to this user
    await Order.deleteMany({ user: user.id });

    // Delete the user
    await User.findByIdAndDelete(user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
