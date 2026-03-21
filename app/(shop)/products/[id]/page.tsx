"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Star, ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!product || !selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toggleCart();
  }

  function handleBuyNow() {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!product || !selectedSize) return;
    addItem(product, selectedSize);
    router.push("/checkout");
  }

  if (loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (notFound || !product)
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-[#5a5a5a] tracking-widest uppercase text-sm">
          Product not found
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="text-xs tracking-[3px] uppercase text-[#c9a84c] border border-[#c9a84c] px-6 py-3 hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-6xl mx-auto py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs text-[#5a5a5a] tracking-widest uppercase hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-[#111111] border border-[#1e1e1e] overflow-hidden mb-3">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1e1e1e]">
                  <ShoppingBag size={64} strokeWidth={1} />
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 border overflow-hidden transition-colors ${selectedImage === i ? "border-[#c9a84c]" : "border-[#1e1e1e] hover:border-[#5a5a5a]"}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs tracking-[4px] text-[#c9a84c] uppercase mb-3 capitalize">
              {product.category}
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-3">
              {product.name}
            </h1>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= Math.round(product.rating)
                          ? "text-[#c9a84c] fill-[#c9a84c]"
                          : "text-[#3a3a3a]"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-[#5a5a5a]">
                  ({product.numReviews} reviews)
                </span>
              </div>
            )}

            <p className="text-3xl font-black text-[#c9a84c] mb-6">
              {formatPrice(product.price)}
            </p>
            <p className="text-[#5a5a5a] text-sm leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-3">
                  Select Size —{" "}
                  <span className="text-white">{selectedSize}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm border tracking-widest transition-colors ${
                        selectedSize === size
                          ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/5"
                          : "border-[#1e1e1e] text-[#5a5a5a] hover:border-white hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p
                className={`text-xs tracking-widest uppercase ${product.stock === 0 ? "text-red-400" : product.stock < 5 ? "text-yellow-400" : "text-green-400"}`}
              >
                {product.stock === 0
                  ? "Out of stock"
                  : product.stock < 5
                    ? `Only ${product.stock} left!`
                    : `${product.stock} in stock`}
              </p>
            </div>

            {/* Login notice for guests */}
            {!session && product.stock > 0 && (
              <div className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 px-4 py-3 mb-4">
                <p className="text-xs text-[#c9a84c] tracking-wide">
                  <Link
                    href="/login"
                    className="underline hover:text-white transition-colors"
                  >
                    Login
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/register"
                    className="underline hover:text-white transition-colors"
                  >
                    create an account
                  </Link>{" "}
                  to add to cart
                </p>
              </div>
            )}

            <div className="mt-auto space-y-3">
              {product.stock === 0 ? (
                <button
                  disabled
                  className="w-full py-4 bg-[#1e1e1e] text-[#5a5a5a] text-xs font-bold tracking-[4px] uppercase cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="w-full py-4 bg-[#1e1e1e] border border-[#c9a84c] text-[#c9a84c] text-xs font-bold tracking-[4px] uppercase hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-colors disabled:opacity-50"
                  >
                    {added
                      ? "✓ Added to Cart"
                      : session
                        ? "Add to Cart"
                        : "Add to Cart (Login Required)"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedSize}
                    className="w-full py-4 bg-[#c9a84c] text-[#0a0a0a] text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {session ? "Buy Now" : "Buy Now (Login Required)"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-20 border-t border-[#1e1e1e] pt-12">
            <h2 className="text-2xl font-black tracking-tight mb-8">REVIEWS</h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="border border-[#1e1e1e] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-sm tracking-widest uppercase">
                      {review.name}
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={
                            s <= review.rating
                              ? "text-[#c9a84c] fill-[#c9a84c]"
                              : "text-[#3a3a3a]"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
