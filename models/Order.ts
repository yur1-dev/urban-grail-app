import { Schema, model, models } from "mongoose";

if (models.Order) delete (models as any).Order;

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "gcash", "maya", "otc", "card", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "expired"],
      default: "pending",
    },
    xenditRef: { type: String },
    xenditInvoiceUrl: { type: String },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    recipientName: { type: String, default: "" },
    notes: { type: String },
    assignedRider: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deliveryProof: { type: String, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Order = model("Order", OrderSchema);
