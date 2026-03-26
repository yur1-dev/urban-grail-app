// app/api/orders/[id]/cancel/route.ts
// Place this at: app/api/orders/[id]/cancel/route.ts in your web app

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verify } from "jsonwebtoken";
import { connectDB } from "@/lib/mongoose";
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Support both mobile (Bearer JWT) and web (session) auth
    let userId: string | null = null;

    const bearerUser = getUserFromBearer(req);
    if (bearerUser) {
      userId = bearerUser.id;
    } else {
      const session = await auth();
      if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      userId = (session.user as any)?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const order = (await Order.findById(id).lean()) as any;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Make sure this order belongs to the requesting user
    if (order.user?.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow cancelling pending or processing orders
    const cancellableStatuses = ["pending", "processing"];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        {
          error: `Cannot cancel an order that is already ${order.status}`,
        },
        { status: 400 },
      );
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true },
    ).lean();

    return NextResponse.json({ success: true, order: updated });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
