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

    const resolvedItems = await Promise.all(
      body.items.map(
        async (item: {
          // Mobile format
          productId?: string;
          // Web format
          product?: string;
          // Shared
          quantity: number;
          size: string;
          price?: number;
          name?: string;
          image?: string;
        }) => {
          // Web sends: { product, quantity, size, price, name, image }
          // Mobile sends: { productId, quantity, size }
          const productId = item.product || item.productId;

          if (!productId) {
            throw new Error("Missing product ID in order item");
          }

          // If the web already sent price/name/image, use them directly
          // to avoid an unnecessary DB lookup
          if (item.price && item.name) {
            return {
              product: productId,
              name: item.name,
              price: item.price,
              image: item.image || "",
              quantity: item.quantity,
              size: item.size,
            };
          }

          // Mobile path: look up product from DB
          const product = (await Product.findById(productId).lean()) as any;
          if (!product) throw new Error(`Product not found: ${productId}`);
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

    const total =
      body.total ??
      resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: user.id,
      items: resolvedItems,
      total,
      address: body.address,
      phone: body.phone,
      paymentMethod: body.paymentMethod,
      notes: body.notes || "",
      recipientName: body.recipientName || "",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
