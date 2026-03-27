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

async function getUser(req: NextRequest) {
  const bearer = getUserFromBearer(req);
  if (bearer) return bearer;
  const session = await auth();
  if (!session) return null;
  return session.user as any;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("assignedRider", "name email")
      .populate("items.product", "name images price")
      .lean();
    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUser(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = user.role;
    if (role !== "admin" && role !== "rider") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const { status, deliveryProof, assignedRider } = body;

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (deliveryProof !== undefined) updateData.deliveryProof = deliveryProof;
    if (assignedRider !== undefined) updateData.assignedRider = assignedRider;

    if (role === "rider") {
      const existing = (await Order.findById(id).lean()) as any;
      if (!existing)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (existing.assignedRider?.toString() !== user.id) {
        return NextResponse.json({ error: "Not your order" }, { status: 403 });
      }
      if (status && !["shipped", "delivered"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      delete updateData.assignedRider;
    }

    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    const order = (await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate("user", "name email")
      .lean()) as any;

    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (status === "delivered" && order.user?.email) {
      try {
        await sendDeliveryEmail({
          to: order.user.email,
          customerName: order.user.name,
          orderId: order._id.toString(),
          deliveryProof: order.deliveryProof,
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function sendDeliveryEmail({
  to,
  customerName,
  orderId,
  deliveryProof,
}: {
  to: string;
  customerName: string;
  orderId: string;
  deliveryProof?: string | null;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shortId = orderId.slice(-6).toUpperCase();

  const proofSection = deliveryProof
    ? `<p style="margin:16px 0 8px;color:#aaa;font-size:13px;">A proof of delivery photo is available in your account.</p>`
    : "";

  const html = `
    <div style="background:#0a0a0a;padding:40px 24px;font-family:sans-serif;max-width:560px;margin:0 auto;">
      <div style="border-bottom:1px solid #1e1e1e;padding-bottom:24px;margin-bottom:24px;">
        <span style="font-size:20px;font-weight:900;color:#fff;letter-spacing:0.18em;">URBAN</span><span style="font-size:20px;font-weight:900;color:#c9a84c;letter-spacing:0.18em;">GRAIL</span>
      </div>
      <h2 style="color:#fff;font-size:18px;font-weight:700;margin:0 0 8px;">Your order has been delivered!</h2>
      <p style="color:#888;font-size:14px;margin:0 0 24px;">Hi ${customerName}, your order #${shortId} was successfully delivered.</p>
      ${proofSection}
      <a href="${appUrl}/account" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-weight:700;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:12px 28px;text-decoration:none;margin-top:16px;">View My Orders</a>
      <p style="color:#3a3a3a;font-size:11px;margin-top:32px;">Thank you for shopping with Urban Grail.</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Urban Grail <noreply@urbangrail.com>",
      to,
      subject: `Your order #${shortId} has been delivered ✓`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}
