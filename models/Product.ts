import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: [
        "tees",
        "hoodies",
        "pants",
        "caps",
        "accessories",
        "shoes",
        "bags",
        "slippers",
      ],
    },
    sizes: [
      {
        type: String,
        enum: [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "Free Size",
        ],
      },
    ],
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", ProductSchema);
