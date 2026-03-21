"use client";
import Link from "next/link";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export function ProductCard({ product }: { product: IProduct }) {
  const { addItem, toggleCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    addItem(product, product.sizes?.[0] || "Free Size");
    toggleCart();
  }

  return (
    <Link
      href={`/products/${product._id}`}
      className="group border border-[#1e1e1e] hover:border-[#8a6f2e] transition-colors"
    >
      <div className="relative aspect-[3/4] bg-[#111111] overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#1e1e1e]">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-[#5a5a5a]">
              Sold Out
            </span>
          </div>
        )}
        {product.stock > 0 && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-[#c9a84c] text-[#0a0a0a] py-3 text-xs font-bold tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            {session ? "Quick Add" : "Add to Cart"}
          </button>
        )}
      </div>
      <div className="p-4 border-t border-[#1e1e1e]">
        <p className="text-sm font-bold tracking-widest uppercase truncate">
          {product.name}
        </p>
        <p className="text-xs text-[#5a5a5a] tracking-widest uppercase mt-1 capitalize">
          {product.category}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[#c9a84c] text-base font-black">
            {formatPrice(product.price)}
          </p>
          {product.numReviews > 0 && (
            <span className="text-xs text-[#5a5a5a]">
              ★ {product.rating?.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
