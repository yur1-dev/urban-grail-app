"use client";
import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Lock,
  Shield,
  Truck,
} from "lucide-react";

const PHILIPPINE_REGIONS = [
  "Metro Manila",
  "NCR",
  "Luzon",
  "Visayas",
  "Mindanao",
  "Cebu",
  "Davao",
  "Quezon City",
  "Makati",
  "Pasig",
  "Taguig",
  "Mandaluyong",
  "Marikina",
  "Caloocan",
  "Malabon",
  "Navotas",
  "Valenzuela",
  "Las Piñas",
  "Parañaque",
  "Pasay",
  "Muntinlupa",
  "San Juan",
  "Pateros",
];

function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return "Phone number is required";
  if (!cleaned.startsWith("09") && !cleaned.startsWith("639"))
    return "Must be a valid PH number starting with 09 or +63";
  if (cleaned.startsWith("09") && cleaned.length !== 11)
    return "PH mobile numbers must be 11 digits (09XXXXXXXXX)";
  if (cleaned.startsWith("639") && cleaned.length !== 12)
    return "Invalid number format";
  return null;
}

function validateAddress(address: string): string | null {
  if (!address.trim()) return "Delivery address is required";
  if (address.trim().length < 15)
    return "Please enter your complete address (street, barangay, city)";
  if (!/\d/.test(address)) return "Address must include a house/unit number";
  return null;
}

function validateName(name: string): string | null {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 3) return "Please enter your full name";
  if (!/^[a-zA-Z\s\.\-\']+$/.test(name.trim()))
    return "Name must contain letters only";
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return "Please enter both first and last name";
  return null;
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle size={11} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-[11px]">{error}</p>
        </div>
      )}
    </div>
  );
}

function CheckoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, total, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const [form, setForm] = useState({
    recipientName: "",
    address: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
    phone: "",
    altPhone: "",
    notes: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    const nameErr = validateName(form.recipientName);
    if (nameErr) e.recipientName = nameErr;
    if (!form.address.trim()) e.address = "Street address is required";
    else if (form.address.trim().length < 5)
      e.address = "Please enter your street/house number";
    if (!form.barangay.trim()) e.barangay = "Barangay is required";
    if (!form.city.trim()) e.city = "City/Municipality is required";
    if (!form.province.trim()) e.province = "Province is required";
    if (!form.zipCode.trim()) e.zipCode = "ZIP code is required";
    else if (!/^\d{4}$/.test(form.zipCode.trim()))
      e.zipCode = "ZIP code must be 4 digits";
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) e.phone = phoneErr;
    if (form.altPhone.trim()) {
      const altErr = validatePhone(form.altPhone);
      if (altErr) e.altPhone = altErr;
    }
    if (!form.agreeToTerms)
      e.agreeToTerms = "You must agree to the terms to place your order";
    return e;
  }, [form, paymentMethod]);

  useEffect(() => {
    if (submitAttempted) setErrors(validate());
  }, [form, submitAttempted, validate]);

  useEffect(() => {
    if (status === "unauthenticated")
      router.push("/login?callbackUrl=/checkout");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && items.length === 0) router.push("/shop");
  }, [status, items.length, router]);

  useEffect(() => {
    if (searchParams.get("failed") === "1") {
      setErrors({
        global: "Payment was cancelled or failed. Please try again.",
      });
    }
  }, [searchParams]);

  if (status === "loading" || status === "unauthenticated")
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (items.length === 0) return null;

  const user = session?.user as any;
  const fullAddress = [
    form.address,
    form.barangay,
    form.city,
    form.province,
    form.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document
        .getElementById(firstKey)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
            size: i.size,
            price: i.product.price,
            name: i.product.name,
            image: i.product.images?.[0] || "",
          })),
          total: total(),
          paymentMethod: paymentMethod === "online" ? "online" : "cod",
          address: fullAddress,
          phone: form.phone,
          notes: form.notes,
          recipientName: form.recipientName,
        }),
      });
      if (!orderRes.ok) {
        const d = await orderRes.json();
        setErrors({
          global: d.error || "Failed to create order. Please try again.",
        });
        setLoading(false);
        return;
      }
      const order = await orderRes.json();
      if (paymentMethod === "online") {
        const payRes = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total(),
            orderId: order._id,
            customerName: form.recipientName || user?.name || "Customer",
            customerEmail: user?.email || "",
          }),
        });
        if (!payRes.ok) {
          setErrors({
            global: "GCash payment setup failed. Please try COD instead.",
          });
          setLoading(false);
          return;
        }
        const payData = await payRes.json();
        await fetch(`/api/orders/${order._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xenditInvoiceUrl: payData.invoiceUrl }),
        });
        clearCart();
        window.location.href = payData.invoiceUrl;
        return;
      }
      clearCart();
      router.push("/account?success=1");
    } catch {
      setErrors({ global: "Something went wrong. Please try again." });
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-[#111111] border ${errors[field] ? "border-red-500" : "border-[#1e1e1e]"} text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors`;

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-5xl mx-auto py-10">
        <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
          Almost There
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-2">CHECKOUT</h1>
        <div className="flex items-center gap-2 mb-10 text-[#5a5a5a]">
          <Lock size={12} />
          <span className="text-xs tracking-widest">Secure checkout</span>
          <span className="text-[#1e1e1e]">·</span>
          <Shield size={12} />
          <span className="text-xs tracking-widest">
            Your info is protected
          </span>
        </div>

        {errors.global && (
          <div className="border border-red-800 bg-red-900/20 text-red-400 text-xs p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            {errors.global}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <form onSubmit={handleOrder} className="space-y-8" noValidate>
            {/* Section 1: Recipient */}
            <div className="border border-[#1e1e1e] p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold tracking-[3px] uppercase">
                  Recipient Info
                </h2>
              </div>
              <Field label="Full Name" error={errors.recipientName} required>
                <input
                  id="recipientName"
                  type="text"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm({ ...form, recipientName: e.target.value })
                  }
                  onBlur={() => submitAttempted && setErrors(validate())}
                  className={inputClass("recipientName")}
                  placeholder="Juan Dela Cruz"
                  autoComplete="name"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number" error={errors.phone} required>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    onBlur={() => submitAttempted && setErrors(validate())}
                    className={inputClass("phone")}
                    placeholder="09XXXXXXXXX"
                    maxLength={11}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Alt. Number (optional)" error={errors.altPhone}>
                  <input
                    id="altPhone"
                    type="tel"
                    value={form.altPhone}
                    onChange={(e) =>
                      setForm({ ...form, altPhone: e.target.value })
                    }
                    className={inputClass("altPhone")}
                    placeholder="09XXXXXXXXX"
                    maxLength={11}
                  />
                </Field>
              </div>
            </div>

            {/* Section 2: Address */}
            <div className="border border-[#1e1e1e] p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold tracking-[3px] uppercase">
                  Delivery Address
                </h2>
              </div>
              <Field label="House No. / Street" error={errors.address} required>
                <input
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  onBlur={() => submitAttempted && setErrors(validate())}
                  className={inputClass("address")}
                  placeholder="123 Rizal Street"
                  autoComplete="address-line1"
                />
              </Field>
              <Field label="Barangay" error={errors.barangay} required>
                <input
                  id="barangay"
                  type="text"
                  value={form.barangay}
                  onChange={(e) =>
                    setForm({ ...form, barangay: e.target.value })
                  }
                  onBlur={() => submitAttempted && setErrors(validate())}
                  className={inputClass("barangay")}
                  placeholder="Barangay San Antonio"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City / Municipality" error={errors.city} required>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    onBlur={() => submitAttempted && setErrors(validate())}
                    className={inputClass("city")}
                    placeholder="Las Piñas"
                    autoComplete="address-level2"
                  />
                </Field>
                <Field
                  label="Province / Region"
                  error={errors.province}
                  required
                >
                  <input
                    id="province"
                    type="text"
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                    onBlur={() => submitAttempted && setErrors(validate())}
                    className={inputClass("province")}
                    placeholder="Metro Manila"
                    autoComplete="address-level1"
                  />
                </Field>
              </div>
              <Field label="ZIP Code" error={errors.zipCode} required>
                <input
                  id="zipCode"
                  type="text"
                  value={form.zipCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      zipCode: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  onBlur={() => submitAttempted && setErrors(validate())}
                  className={`${inputClass("zipCode")} w-32`}
                  placeholder="1740"
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </Field>
              {fullAddress.length > 10 &&
                !errors.address &&
                !errors.barangay &&
                !errors.city &&
                !errors.province && (
                  <div className="bg-[#0a0a0a] border border-[#1e1e1e] p-3 flex items-start gap-2">
                    <Truck
                      size={13}
                      className="text-[#c9a84c] flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-[10px] tracking-[2px] uppercase text-[#5a5a5a] mb-0.5">
                        Delivering to
                      </p>
                      <p className="text-xs text-white">{fullAddress}</p>
                    </div>
                  </div>
                )}
              <Field label="Order Notes (optional)" error={errors.notes}>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={inputClass("notes")}
                  placeholder="Leave at door, specific landmark, etc."
                  maxLength={200}
                />
                <p className="text-[10px] text-[#3a3a3a] mt-1 text-right">
                  {form.notes.length}/200
                </p>
              </Field>
            </div>

            {/* Section 3: Payment */}
            <div className="border border-[#1e1e1e] p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h2 className="text-sm font-bold tracking-[3px] uppercase">
                  Payment Method
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`py-5 px-4 border text-left transition-all relative ${paymentMethod === "cod" ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-[#1e1e1e] hover:border-[#3a3a3a]"}`}
                >
                  {paymentMethod === "cod" && (
                    <CheckCircle2
                      size={14}
                      className="absolute top-3 right-3 text-[#c9a84c]"
                    />
                  )}
                  <span className="block text-2xl mb-2">💵</span>
                  <span
                    className={`block text-xs font-bold tracking-[2px] uppercase ${paymentMethod === "cod" ? "text-[#c9a84c]" : "text-white"}`}
                  >
                    Cash on Delivery
                  </span>
                  <span className="block text-xs text-[#5a5a5a] mt-1">
                    Pay when you receive
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`py-5 px-4 border text-left transition-all relative ${paymentMethod === "online" ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-[#1e1e1e] hover:border-[#3a3a3a]"}`}
                >
                  {paymentMethod === "online" && (
                    <CheckCircle2
                      size={14}
                      className="absolute top-3 right-3 text-[#c9a84c]"
                    />
                  )}
                  <span className="block text-2xl mb-2">📱</span>
                  <span
                    className={`block text-xs font-bold tracking-[2px] uppercase ${paymentMethod === "online" ? "text-[#c9a84c]" : "text-white"}`}
                  >
                    GCash
                  </span>
                  <span className="block text-xs text-[#5a5a5a] mt-1">
                    Pay via GCash
                  </span>
                </button>
              </div>
              {paymentMethod === "cod" && (
                <div className="border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <p className="text-xs text-yellow-400 font-bold tracking-widest uppercase mb-1">
                    COD Reminder
                  </p>
                  <ul className="text-xs text-[#5a5a5a] space-y-1 list-disc list-inside">
                    <li>Prepare the exact amount upon delivery</li>
                    <li>
                      Order may be cancelled if you're not available to receive
                    </li>
                    <li>Check items before signing</li>
                  </ul>
                </div>
              )}
              {paymentMethod === "online" && (
                <div className="border border-[#c9a84c]/20 bg-[#c9a84c]/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={11} className="text-[#c9a84c]" />
                    <p className="text-xs text-[#c9a84c] font-bold tracking-widest uppercase">
                      Secure GCash Payment
                    </p>
                  </div>
                  <p className="text-xs text-[#5a5a5a] leading-relaxed">
                    You'll be redirected to a secure Xendit-powered GCash page.
                    Amount:{" "}
                    <span className="text-[#c9a84c] font-bold">
                      {formatPrice(total())}
                    </span>
                    . Order confirmed automatically after payment.
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 cursor-pointer group ${errors.agreeToTerms ? "text-red-400" : "text-[#5a5a5a]"}`}
              >
                <div
                  onClick={() =>
                    setForm({ ...form, agreeToTerms: !form.agreeToTerms })
                  }
                  className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors cursor-pointer ${
                    form.agreeToTerms
                      ? "bg-[#c9a84c] border-[#c9a84c]"
                      : errors.agreeToTerms
                        ? "border-red-500"
                        : "border-[#3a3a3a] group-hover:border-[#5a5a5a]"
                  }`}
                >
                  {form.agreeToTerms && (
                    <span className="text-[#0a0a0a] text-xs font-black">✓</span>
                  )}
                </div>
                <span className="text-xs leading-relaxed">
                  I confirm that my delivery information is correct and I agree
                  to Urban Grail's{" "}
                  <span className="text-[#c9a84c] underline cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#c9a84c] underline cursor-pointer">
                    Return Policy
                  </span>
                  .
                  {paymentMethod === "online" &&
                    " I understand I will be redirected to complete GCash payment."}
                </span>
              </label>
              {errors.agreeToTerms && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={11} className="text-red-400" />
                  <p className="text-red-400 text-[11px]">
                    {errors.agreeToTerms}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="space-y-3">
              {submitAttempted && Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 border border-red-800 bg-red-900/10 p-3">
                  <AlertCircle
                    size={13}
                    className="text-red-400 flex-shrink-0"
                  />
                  <p className="text-red-400 text-xs">
                    Please fix {Object.keys(errors).length} error
                    {Object.keys(errors).length > 1 ? "s" : ""} before placing
                    your order.
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-xs font-bold tracking-[4px] uppercase transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-[#c9a84c]/50 text-[#0a0a0a] cursor-not-allowed"
                    : "bg-[#c9a84c] text-[#0a0a0a] hover:bg-white"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    {paymentMethod === "online"
                      ? "Redirecting to GCash..."
                      : "Placing Order..."}
                  </>
                ) : (
                  <>
                    {paymentMethod === "cod"
                      ? "Place Order (COD)"
                      : "Pay with GCash →"}
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
              <p className="text-center text-[#3a3a3a] text-[10px] tracking-widest uppercase">
                By placing this order you agree to our terms
              </p>
            </div>
          </form>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="border border-[#1e1e1e] p-6 sticky top-24">
              <h3 className="text-xs tracking-[4px] uppercase text-[#5a5a5a] mb-6">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                items)
              </h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-14 h-14 bg-[#1e1e1e] flex-shrink-0 overflow-hidden">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute -top-1 -right-1 bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>
                        <p className="font-medium text-xs leading-tight">
                          {item.product.name}
                        </p>
                        <p className="text-[#5a5a5a] text-[10px] mt-0.5 uppercase tracking-widest">
                          {item.size}
                        </p>
                        <p className="text-[#3a3a3a] text-[10px] mt-0.5">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>
                      <p className="text-[#c9a84c] text-xs font-black">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#1e1e1e] pt-4 space-y-2">
                <div className="flex justify-between text-xs text-[#5a5a5a]">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5a5a5a]">
                  <span>Shipping</span>
                  <span className="text-yellow-400">To be arranged</span>
                </div>
                <div className="flex justify-between text-xs text-[#5a5a5a]">
                  <span>Payment</span>
                  <span className="text-white uppercase tracking-wider text-[10px]">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "GCash"}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#1e1e1e]">
                  <span className="text-xs tracking-widest uppercase text-[#5a5a5a]">
                    Total
                  </span>
                  <span className="text-2xl font-black text-[#c9a84c]">
                    {formatPrice(total())}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1e1e1e] grid grid-cols-3 gap-2">
                {[
                  { icon: "🔒", label: "Secure" },
                  { icon: "📦", label: "Tracked" },
                  { icon: "↩️", label: "Returns" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-[9px] tracking-widest uppercase text-[#3a3a3a]">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
