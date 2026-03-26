"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus } from "lucide-react";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
        showToast("Product deleted successfully", "success");
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setDeleting(null);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Admin
            </p>
            <h1 className="text-5xl font-black tracking-tight">PRODUCTS</h1>
            <p className="text-[#5a5a5a] text-xs mt-2">
              {products.length} products total
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 text-xs font-bold tracking-[3px] uppercase hover:bg-white transition-colors cursor-pointer"
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <p className="text-[#5a5a5a] text-xs tracking-widest uppercase mb-4">
                      No products yet
                    </p>
                    <Link
                      href="/dashboard/products/new"
                      className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 text-xs font-bold tracking-[3px] uppercase hover:bg-white transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Add First Product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-[#1e1e1e] hover:bg-[#111111] transition-colors"
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
                        <div>
                          <span className="font-medium text-sm">
                            {product.name}
                          </span>
                          {product.featured && (
                            <span className="ml-2 text-[9px] tracking-[2px] uppercase px-1.5 py-0.5 border border-[#c9a84c]/30 text-[#c9a84c]">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#5a5a5a] capitalize text-xs tracking-widest">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-[#c9a84c] font-bold">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 ${
                          product.stock === 0
                            ? "text-red-400 bg-red-400/10"
                            : product.stock < 5
                              ? "text-yellow-400 bg-yellow-400/10"
                              : "text-green-400 bg-green-400/10"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                          className="text-[#5a5a5a] hover:text-[#c9a84c] transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleting === product._id}
                          className="text-[#5a5a5a] hover:text-red-400 transition-colors cursor-pointer disabled:opacity-40"
                          title="Delete product"
                        >
                          {deleting === product._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border text-xs font-medium ${
            toast.type === "success"
              ? "bg-green-900/90 border-green-500/40 text-green-300"
              : "bg-red-900/90 border-red-500/40 text-red-300"
          }`}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
}
