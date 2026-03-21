import { IProduct } from "@/types";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products?featured=true&limit=6`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  return (
    <section className="px-6 py-24 border-t border-[#1e1e1e] bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Latest Drop
            </p>
            <h2 className="text-6xl font-black tracking-tight">FRESH FITS</h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:block text-xs tracking-[3px] text-[#5a5a5a] uppercase border border-[#1e1e1e] px-6 py-3 hover:border-white hover:text-white transition-colors"
          >
            View All
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-20 text-[#5a5a5a]">
            <p className="text-sm tracking-widest uppercase">
              Run the seed script to populate your store.
            </p>
            <p className="text-xs mt-2 text-[#3a3a3a]">
              npx tsx scripts/seed.ts
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
