import mongoose from "mongoose";
import { hash } from "bcryptjs";

const MONGODB_URI =
  "mongodb+srv://boya02x_db_user:fpZUSwwkBy7DvmRv@cluster0.7uqxkbm.mongodb.net/urban-grail?retryWrites=true&w=majority&appName=Cluster0";

const UserSchema = new mongoose.Schema(
  { name: String, email: String, password: String, role: String },
  { timestamps: true },
);
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    images: [String],
    category: String,
    sizes: [String],
    stock: Number,
    featured: Boolean,
    reviews: [],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  {
    name: "Grail Classic Tee",
    description:
      "Premium heavyweight cotton tee. Relaxed oversized fit, reinforced collar, and a signature Urban Grail woven label.",
    price: 890,
    images: ["/tee-1.jpg", "/tee-2.jpg"],
    category: "tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 50,
    featured: true,
  },
  {
    name: "Shadow Script Tee",
    description:
      "Washed black tee with embroidered script on the chest. 100% cotton, pre-shrunk, garment-dyed finish.",
    price: 950,
    images: ["/tee-3.jpg", "/tee-4.jpg"],
    category: "tees",
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
    featured: true,
  },
  {
    name: "Void Graphic Tee",
    description:
      "Bold graphic print on ultra-soft cotton. Dropped shoulders, boxy cut, and ribbed hem.",
    price: 890,
    images: ["/tee-5.jpg", "/tee-6.jpg"],
    category: "tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 40,
    featured: false,
  },
  {
    name: "Culture Tee Vol.2",
    description:
      "Limited edition culture series. Screen-printed on 220gsm ring-spun cotton. Built to outlast trends.",
    price: 990,
    images: ["/tee-7.jpg", "/tee-8.jpg"],
    category: "tees",
    sizes: ["M", "L", "XL"],
    stock: 20,
    featured: false,
  },
  {
    name: "Monochrome Block Tee",
    description:
      "Tonal colorblock construction with contrast stitching. Two-fabric panel design for a structured silhouette.",
    price: 1050,
    images: ["/tee-9.jpg", "/tee-10.jpg"],
    category: "tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 30,
    featured: false,
  },
  {
    name: "Archive Tee",
    description:
      "Inspired by archive collections. Faded vintage wash, relaxed fit, double-needle stitched seams throughout.",
    price: 890,
    images: ["/tee-11.jpg", "/tee-12.jpg"],
    category: "tees",
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    featured: true,
  },
  {
    name: "Phantom Tee",
    description:
      "Ultra-lightweight supplex fabric with a ghost print. Barely-there feel, maximum statement.",
    price: 920,
    images: ["/tee-13.jpg", "/tee-14.jpg"],
    category: "tees",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 25,
    featured: false,
  },
  {
    name: "Grail Heavyweight Hoodie",
    description:
      "Heavyweight 400gsm fleece. Triple-stitched pockets, metal zipper pull, and brushed interior lining for all-season wear.",
    price: 2200,
    images: ["/hood-1.jpg", "/hood-2.jpg"],
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 30,
    featured: true,
  },
  {
    name: "Arch Logo Hoodie",
    description:
      "Arch-print logo on premium cotton-poly blend fleece. Oversized hood, kangaroo pocket, ribbed cuffs and hem.",
    price: 2400,
    images: ["/hood-3.jpg", "/hood-4.jpg"],
    category: "hoodies",
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    featured: true,
  },
  {
    name: "Washed Pullover Hoodie",
    description:
      "Acid-washed pullover in a relaxed silhouette. Garment-dyed for a lived-in feel. Minimal branding.",
    price: 2100,
    images: ["/hood-5.jpg", "/hood-6.jpg"],
    category: "hoodies",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 15,
    featured: false,
  },
  {
    name: "Tech Fleece Hoodie",
    description:
      "Performance tech fleece with moisture-wicking properties. Zippered side pockets, flat drawcord, reflective logo.",
    price: 2600,
    images: ["/hood-7.jpg", "/hood-8.jpg"],
    category: "hoodies",
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    featured: false,
  },
  {
    name: "Utility Zip Hoodie",
    description:
      "Full-zip utility hoodie with dual patch pockets. Heavyweight French terry, relaxed fit, woven interior label.",
    price: 2800,
    images: ["/hood-9.jpg", "/hood-10.jpg"],
    category: "hoodies",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 12,
    featured: false,
  },
  {
    name: "Capsule Hoodie Vol.1",
    description:
      "First in the capsule collection series. Limited run, embroidered patches, premium 380gsm fleece.",
    price: 3200,
    images: ["/hood-11.jpg", "/hood-12.jpg"],
    category: "hoodies",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    featured: true,
  },
  {
    name: "Grail Runner Low",
    description:
      "Lightweight runner silhouette with a vulcanized rubber sole. Breathable mesh upper, foam-padded collar for all-day comfort.",
    price: 3500,
    images: ["/shoe-1.jpg", "/shoe-2.jpg"],
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 20,
    featured: true,
  },
  {
    name: "Street Force 1",
    description:
      "High-top street silhouette. Genuine leather upper, cushioned insole, and a durable cupsole with herringbone traction.",
    price: 4200,
    images: ["/shoe-3.jpg", "/shoe-4.jpg"],
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 15,
    featured: true,
  },
  {
    name: "Grail Foam Runner",
    description:
      "One-piece foam construction for maximum cushioning. Unique perforated upper, slip-on design, eco-friendly material.",
    price: 2800,
    images: ["/shoe-5.jpg", "/shoe-6.jpg"],
    category: "shoes",
    sizes: ["7", "8", "9", "10"],
    stock: 10,
    featured: false,
  },
  {
    name: "Tech Court Low",
    description:
      "Court-inspired low-top with a clean profile. Suede toe cap, EVA midsole, gum rubber outsole.",
    price: 3800,
    images: ["/shoe-7.jpg", "/shoe-8.jpg"],
    category: "shoes",
    sizes: ["8", "9", "10", "11"],
    stock: 12,
    featured: false,
  },
  {
    name: "Phantom Runner",
    description:
      "Ghost-white colorway with a translucent midsole. Knit upper, responsive foam, and a tonal lace system.",
    price: 4500,
    images: ["/shoe-9.jpg", "/shoe-10.jpg"],
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 8,
    featured: false,
  },
  {
    name: "Heritage Boot",
    description:
      "Ankle-height boot with a weathered leather upper. Vibram outsole, speed-lacing system, waterproof membrane.",
    price: 5200,
    images: ["/shoe-11.jpg"],
    category: "shoes",
    sizes: ["8", "9", "10", "11"],
    stock: 6,
    featured: false,
  },
  {
    name: "Grail Tote Bag",
    description:
      "Heavy-duty canvas tote with leather-reinforced handles. Interior zipper pocket, Urban Grail woven patch.",
    price: 1200,
    images: ["/bag-1.jpg", "/bag-2.jpg"],
    category: "bags",
    sizes: ["Free Size"],
    stock: 40,
    featured: true,
  },
  {
    name: "Tactical Backpack",
    description:
      "25L tactical backpack with laptop sleeve. MOLLE webbing, padded shoulder straps, and hidden pockets throughout.",
    price: 2800,
    images: ["/bag-3.jpg", "/bag-4.jpg"],
    category: "bags",
    sizes: ["Free Size"],
    stock: 20,
    featured: true,
  },
  {
    name: "Mini Shoulder Bag",
    description:
      "Compact crossbody in premium nylon. Adjustable strap, two main compartments, and a snap closure.",
    price: 1500,
    images: ["/bag-5.jpg", "/bag-6.jpg"],
    category: "bags",
    sizes: ["Free Size"],
    stock: 25,
    featured: false,
  },
  {
    name: "Utility Waist Bag",
    description:
      "Multi-pocket waist bag in water-resistant ripstop. Adjustable belt, dual zip compartments, and a carabiner loop.",
    price: 980,
    images: ["/bag-7.jpg", "/bag-8.jpg"],
    category: "bags",
    sizes: ["Free Size"],
    stock: 30,
    featured: false,
  },
  {
    name: "Grail Slide",
    description:
      "Molded EVA slide with a contoured footbed. Ultra-lightweight, water-friendly, and cushioned for recovery wear.",
    price: 650,
    images: ["/slipp-1.jpg", "/slipp-2.jpg"],
    category: "slippers",
    sizes: ["7", "8", "9", "10", "11"],
    stock: 50,
    featured: true,
  },
  {
    name: "Foam Sandal",
    description:
      "One-piece foam sandal with a grippy outsole. Minimal design, maximum comfort. Perfect post-workout recovery.",
    price: 580,
    images: ["/slipp-3.jpg", "/slipp-4.jpg"],
    category: "slippers",
    sizes: ["7", "8", "9", "10"],
    stock: 35,
    featured: false,
  },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected");

  const adminExists = await User.findOne({ email: "admin@urbangrail.com" });
  if (!adminExists) {
    const pw = await hash("admin123", 12);
    await User.create({
      name: "Admin",
      email: "admin@urbangrail.com",
      password: pw,
      role: "admin",
    });
    console.log("✅ Admin created: admin@urbangrail.com / admin123");
  } else {
    await User.findOneAndUpdate(
      { email: "admin@urbangrail.com" },
      { role: "admin" },
    );
    console.log("✅ Admin already exists — role confirmed");
  }

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products`);

  await mongoose.disconnect();
  console.log("✅ Done! Your shop is ready.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
