"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus } from "lucide-react";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== id));
  }

  if (loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Admin
            </p>
            <h1 className="text-5xl font-black tracking-tight">PRODUCTS</h1>
          </div>
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 text-xs font-bold tracking-[3px] uppercase hover:bg-white transition-colors"
          >
            <Plus size={14} /> Add Product
          </Link>
        </div>
        <div className="border border-[#1e1e1e] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#1e1e1e] bg-[#111111]">
              <tr>
                {["Product", "Category", "Price", "Stock", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs tracking-[3px] uppercase text-[#5a5a5a]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-[#1e1e1e] hover:bg-[#111111]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1e1e1e] flex-shrink-0 overflow-hidden">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#5a5a5a] capitalize text-xs tracking-widest">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-[#c9a84c] font-bold">
                    {formatPrice(product.price)}
                  </td>
                  <td
                    className={`px-4 py-3 text-xs font-bold ${product.stock === 0 ? "text-red-400" : product.stock < 5 ? "text-yellow-400" : "text-green-400"}`}
                  >
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/products/${product._id}/edit`}
                        className="text-[#5a5a5a] hover:text-[#c9a84c] transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-[#5a5a5a] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-[#5a5a5a] text-xs tracking-widest uppercase"
                  >
                    No products yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
