import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import pkg from "mongoose";
const { connect, disconnect, Schema, model, models } = pkg;

import { v2 as cloudinary } from "cloudinary";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const ProductSchema = new Schema({
  name: { type: String },
  images: [{ type: String }],
});

const Product = models.Product || model("Product", ProductSchema);

function needsMigration(str: string): boolean {
  return (
    str.startsWith("data:image/") ||
    str.startsWith("/") ||
    (str.length > 200 && !str.startsWith("http"))
  );
}

async function uploadToCloudinary(input: string): Promise<string> {
  // If it's a local path like /tee-1.jpg, read from disk
  let uploadSource = input;
  if (input.startsWith("/") && !input.startsWith("//")) {
    const filePath = join(process.cwd(), "public", input);
    if (!existsSync(filePath)) {
      throw new Error(`File not found on disk: ${filePath}`);
    }
    const buffer = readFileSync(filePath);
    const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    uploadSource = base64;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      uploadSource,
      { folder: "urban-grail/products", resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
  });
}

async function migrate() {
  console.log("Connecting to MongoDB...");
  await connect(process.env.MONGODB_URI!);
  console.log("Connected.\n");

  const products = await Product.find({});
  console.log(`Found ${products.length} products.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const newImages: string[] = [];
    let needsUpdate = false;

    for (const img of product.images as string[]) {
      if (needsMigration(img)) {
        console.log(`  [${product.name}] Uploading ${img}...`);
        try {
          const url = await uploadToCloudinary(img);
          newImages.push(url);
          needsUpdate = true;
          console.log(`  ✓ → ${url}`);
        } catch (err: any) {
          console.error(`  ✗ Failed: ${err.message}`);
          newImages.push(img);
        }
      } else {
        newImages.push(img);
      }
    }

    if (needsUpdate) {
      await Product.findByIdAndUpdate(
        product._id,
        { images: newImages },
        { new: true },
      );
      console.log(`  ✓ Updated "${product.name}"\n`);
      updated++;
    } else {
      console.log(`  — Skipped "${product.name}"\n`);
      skipped++;
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
  await disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
