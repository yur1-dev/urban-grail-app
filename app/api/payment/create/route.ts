import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verify } from "jsonwebtoken";

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

export async function POST(req: NextRequest) {
  try {
    let user = getUserFromBearer(req);
    if (!user) {
      const session = await auth();
      if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      user = session.user as any;
    }

    const { amount, orderId, customerName, customerEmail, source } =
      await req.json();

    // Use deep link for mobile, web URL for web
    const isMobile = source === "mobile";
    const mobileScheme = process.env.MOBILE_APP_SCHEME || "manus20260326111125";

    const successRedirect = isMobile
      ? `${mobileScheme}://payment/success?orderId=${orderId}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/account?success=1`;

    const failureRedirect = isMobile
      ? `${mobileScheme}://payment/failed?orderId=${orderId}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/checkout?failed=1`;

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
        success_redirect_url: successRedirect,
        failure_redirect_url: failureRedirect,
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
