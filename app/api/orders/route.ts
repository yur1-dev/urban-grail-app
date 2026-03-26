import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Order } from "@/models/Order";
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
    const query = user.role === "admin" ? {} : { user: user.id };
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = getUserFromBearer(req);
    if (!user) {
      const session = await auth();
      if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      user = session.user as any;
    }

    await connectDB();
    const body = await req.json();
    const order = await Order.create({ ...body, user: user.id });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
