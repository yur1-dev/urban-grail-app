"use client";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } =
    useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen) return null;

  function handleCheckout() {
    toggleCart();
    if (!session) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={toggleCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111111] border-l border-[#1e1e1e] z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e1e]">
          <h2 className="text-lg font-bold tracking-widest uppercase">
            Your Cart
          </h2>
          <button
            onClick={toggleCart}
            className="text-[#5a5a5a] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[#5a5a5a]">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-sm tracking-widest uppercase">
              Your cart is empty
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}`}
                  className="flex gap-4 border-b border-[#1e1e1e] pb-4"
                >
                  <div className="w-20 h-20 bg-[#1e1e1e] flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-[#5a5a5a] tracking-widest uppercase mt-1">
                      Size: {item.size}
                    </p>
                    <p className="text-[#c9a84c] text-sm mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.size,
                            item.quantity - 1,
                          )
                        }
                        className="text-[#5a5a5a] hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.size,
                            item.quantity + 1,
                          )
                        }
                        className="text-[#5a5a5a] hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product._id, item.size)}
                        className="ml-auto text-[#5a5a5a] hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#1e1e1e]">
              {!session && (
                <p className="text-xs text-[#c9a84c] text-center mb-3 tracking-wide">
                  You need to login to checkout
                </p>
              )}
              <div className="flex justify-between mb-4">
                <span className="text-sm text-[#5a5a5a] tracking-widest uppercase">
                  Total
                </span>
                <span className="text-lg font-bold text-[#c9a84c]">
                  {formatPrice(total())}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="block w-full bg-[#c9a84c] text-[#0a0a0a] text-center py-3 text-sm font-bold tracking-widest uppercase hover:bg-white transition-colors"
              >
                {session ? "Checkout" : "Login to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
