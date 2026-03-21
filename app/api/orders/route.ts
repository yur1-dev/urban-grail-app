import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const user = session.user as any;
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
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const user = session.user as any;
    const order = await Order.create({ ...body, user: user.id });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
