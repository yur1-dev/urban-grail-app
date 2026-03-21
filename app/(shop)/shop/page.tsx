import { Suspense } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";

async function getProducts(category?: string, search?: string) {
  try {
    await connectDB();
    const query: Record<string, any> = {};
    if (category && category !== "all") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    const products = await Product.find(query).limit(24).lean();
    return {
      products: JSON.parse(JSON.stringify(products)),
      total: products.length,
    };
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
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
