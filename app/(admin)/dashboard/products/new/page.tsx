"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AlertCircle, ArrowLeft } from "lucide-react";

const CATEGORIES = [
  "tees",
  "hoodies",
  "pants",
  "caps",
  "accessories",
  "shoes",
  "bags",
  "slippers",
];
const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "Free Size",
];

function Field({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-[#3a3a3a] mt-1">{hint}</p>
      )}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle size={11} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-[11px]">{error}</p>
        </div>
      )}
    </div>
  );
}

const INPUT =
  "w-full bg-[#0a0a0a] border border-[#1e1e1e] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "tees",
    sizes: [] as string[],
    stock: "",
    images: [] as string[],
    featured: false,
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price) e.price = "Price is required";
    else if (parseFloat(form.price) <= 0)
      e.price = "Price must be greater than 0";
    if (!form.stock) e.stock = "Stock is required";
    else if (parseInt(form.stock) < 0) e.stock = "Stock cannot be negative";
    if (form.images.length === 0) e.images = "At least one image is required";
    if (form.sizes.length === 0) e.sizes = "Select at least one size";
    return e;
  }

  function toggleSize(size: string) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }),
    });

    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      const d = await res.json();
      setErrors({ global: d.error || "Failed to save product" });
      setLoading(false);
    }
  }

  // Live validation after first submit attempt
  if (submitted) {
    const fresh = validate();
    if (JSON.stringify(fresh) !== JSON.stringify(errors)) setErrors(fresh);
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-3xl mx-auto py-10">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs text-[#5a5a5a] hover:text-white transition-colors mb-8 tracking-widest uppercase"
        >
          <ArrowLeft size={13} /> Back
        </button>

        <p className="text-[10px] tracking-[5px] text-[#c9a84c] uppercase mb-3">
          Admin
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-10">
          ADD PRODUCT
        </h1>

        {errors.global && (
          <div className="border border-red-800 bg-red-900/20 text-red-400 text-xs p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* ── Section 1: Images ── */}
          <div className="border border-[#1e1e1e] p-6 space-y-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold tracking-[3px] uppercase">
                Product Images
              </h2>
            </div>
            <Field
              label="Upload Images"
              error={errors.images}
              required
              hint="First image will be the main display image. Max 5MB each."
            >
              <ImageUploader
                images={form.images}
                onChange={(imgs) => setForm({ ...form, images: imgs })}
              />
            </Field>
          </div>

          {/* ── Section 2: Basic Info ── */}
          <div className="border border-[#1e1e1e] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold tracking-[3px] uppercase">
                Product Info
              </h2>
            </div>

            <Field label="Product Name" error={errors.name} required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`${INPUT} ${errors.name ? "border-red-500" : ""}`}
                placeholder="e.g. Grail Oversized Tee"
              />
            </Field>

            <Field label="Description" error={errors.description} required>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`${INPUT} resize-none ${errors.description ? "border-red-500" : ""}`}
                placeholder="Describe the product — material, fit, feel..."
              />
              <p className="text-[10px] text-[#3a3a3a] mt-1 text-right">
                {form.description.length} chars
              </p>
            </Field>

            <Field label="Category" required>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={INPUT}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111111] capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* ── Section 3: Pricing & Stock ── */}
          <div className="border border-[#1e1e1e] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold tracking-[3px] uppercase">
                Pricing & Stock
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (PHP)" error={errors.price} required>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a5a5a] text-sm">
                    ₱
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className={`${INPUT} pl-8 ${errors.price ? "border-red-500" : ""}`}
                    placeholder="890"
                  />
                </div>
              </Field>

              <Field label="Stock Quantity" error={errors.stock} required>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={`${INPUT} ${errors.stock ? "border-red-500" : ""}`}
                  placeholder="50"
                />
              </Field>
            </div>

            {/* Stock indicator */}
            {form.stock && (
              <div
                className={`text-[11px] px-3 py-2 border ${
                  parseInt(form.stock) === 0
                    ? "border-red-500/30 bg-red-500/5 text-red-400"
                    : parseInt(form.stock) <= 5
                      ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-400"
                      : "border-green-500/30 bg-green-500/5 text-green-400"
                }`}
              >
                {parseInt(form.stock) === 0
                  ? "⚠ Out of stock — product won't be purchasable"
                  : parseInt(form.stock) <= 5
                    ? `⚠ Low stock warning — only ${form.stock} units`
                    : `✓ ${form.stock} units in stock`}
              </div>
            )}
          </div>

          {/* ── Section 4: Sizes ── */}
          <div className="border border-[#1e1e1e] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                4
              </span>
              <h2 className="text-sm font-bold tracking-[3px] uppercase">
                Available Sizes
              </h2>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 text-sm border tracking-widest transition-colors ${
                      form.sizes.includes(size)
                        ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/5"
                        : "border-[#1e1e1e] text-[#5a5a5a] hover:border-white hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle size={11} className="text-red-400" />
                  <p className="text-red-400 text-[11px]">{errors.sizes}</p>
                </div>
              )}
              {form.sizes.length > 0 && (
                <p className="text-[11px] text-[#5a5a5a] mt-2">
                  Selected:{" "}
                  <span className="text-[#c9a84c]">
                    {form.sizes.join(", ")}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* ── Section 5: Settings ── */}
          <div className="border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-black flex items-center justify-center">
                5
              </span>
              <h2 className="text-sm font-bold tracking-[3px] uppercase">
                Settings
              </h2>
            </div>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors cursor-pointer ${
                  form.featured
                    ? "bg-[#c9a84c] border-[#c9a84c]"
                    : "border-[#3a3a3a] group-hover:border-[#5a5a5a]"
                }`}
              >
                {form.featured && (
                  <span className="text-[#0a0a0a] text-xs font-black">✓</span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold">Feature on Homepage</p>
                <p className="text-xs text-[#5a5a5a] mt-0.5">
                  This product will appear in the Featured section on the
                  homepage.
                </p>
              </div>
            </label>
          </div>

          {/* Validation summary */}
          {submitted &&
            Object.keys(errors).filter((k) => k !== "global").length > 0 && (
              <div className="border border-red-800 bg-red-900/10 p-4 flex items-start gap-3">
                <AlertCircle
                  size={14}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-red-400 text-xs">
                  Please fix{" "}
                  {Object.keys(errors).filter((k) => k !== "global").length}{" "}
                  error
                  {Object.keys(errors).filter((k) => k !== "global").length > 1
                    ? "s"
                    : ""}{" "}
                  above before saving.
                </p>
              </div>
            )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-[#1e1e1e] text-[#5a5a5a] py-4 text-xs font-bold tracking-[4px] uppercase hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#c9a84c] text-[#0a0a0a] py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
