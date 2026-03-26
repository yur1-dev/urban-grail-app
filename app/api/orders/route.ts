import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
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

    // Mobile sends: { items: [{productId, quantity, size}], address, phone, paymentMethod, notes }
    // We need to look up each product and build the full items array
    const resolvedItems = await Promise.all(
      body.items.map(
        async (item: { productId: string; quantity: number; size: string }) => {
          const product = (await Product.findById(
            item.productId,
          ).lean()) as any;
          if (!product) throw new Error(`Product not found: ${item.productId}`);
          return {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: item.quantity,
            size: item.size,
          };
        },
      ),
    );

    const total = resolvedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: user.id,
      items: resolvedItems,
      total,
      address: body.address,
      phone: body.phone,
      paymentMethod: body.paymentMethod,
      notes: body.notes || "",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
