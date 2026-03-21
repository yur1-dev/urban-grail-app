import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook token from Xendit
    const webhookToken = req.headers.get("x-callback-token");
    if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (body.status === "PAID" || body.status === "SETTLED") {
      await connectDB();
      await Order.findByIdAndUpdate(body.external_id, {
        status: "processing",
        paymentStatus: "paid",
        xenditRef: body.id,
      });
      console.log(`✅ Order ${body.external_id} marked as paid`);
    }

    if (body.status === "EXPIRED") {
      await connectDB();
      await Order.findByIdAndUpdate(body.external_id, {
        paymentStatus: "failed",
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
