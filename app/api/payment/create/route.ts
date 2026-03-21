import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount, orderId, customerName, customerEmail } = await req.json();

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        external_id: orderId,
        amount: Math.round(amount),
        currency: "PHP",
        description: `Urban Grail Order #${orderId.slice(-6).toUpperCase()}`,
        invoice_duration: 86400,
        customer: {
          given_names: customerName || "Customer",
          email: customerEmail || "",
        },
        success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=1`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?failed=1`,
        payment_methods: ["GCASH"],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Xendit error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data?.message || "Payment failed" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      invoiceUrl: data.invoice_url,
      invoiceId: data.id,
    });
  } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
