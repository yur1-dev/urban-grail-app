import { Suspense } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { IProduct } from "@/types";

async function getProducts(category?: string, search?: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    params.set("limit", "24");
    const res = await fetch(`${baseUrl}/api/products?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return { products: [], total: 0 };
    return await res.json();
  } catch {
    return { products: [], total: 0 };
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const { products, total } = await getProducts(
    resolvedParams.category,
    resolvedParams.search,
  );
  const activeCategory = resolvedParams.category || "all";
  const activeSearch = resolvedParams.search || "";

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="py-10 border-b border-[#1e1e1e] mb-10">
          <h1 className="text-6xl font-black tracking-tight">SHOP ALL</h1>
          <p className="text-[#5a5a5a] text-sm mt-2 tracking-widest">
            {total} products
          </p>
        </div>

        <Suspense fallback={null}>
          <ShopFilters
            activeCategory={activeCategory}
            activeSearch={activeSearch}
          />
        </Suspense>

        {products.length === 0 ? (
          <div className="text-center py-20 text-[#5a5a5a]">
            <p className="text-sm tracking-widest uppercase">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
            {products.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
