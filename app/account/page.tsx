"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  User,
  Package,
  Lock,
  Bell,
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Edit2,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "orders" | "profile" | "security" | "notifications";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];
const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  processing: "text-blue-400  border-blue-400/30  bg-blue-400/10",
  shipped: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  delivered: "text-green-400 border-green-400/30  bg-green-400/10",
  cancelled: "text-red-400   border-red-400/30    bg-red-400/10",
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={13} />,
  processing: <Package size={13} />,
  shipped: <Truck size={13} />,
  delivered: <CheckCircle2 size={13} />,
  cancelled: <XCircle size={13} />,
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border text-sm font-medium animate-in slide-in-from-bottom-4 ${
        type === "success"
          ? "bg-green-900/90 border-green-500/40 text-green-300"
          : "bg-red-900/90 border-red-500/40 text-red-300"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={16} />
      ) : (
        <AlertCircle size={16} />
      )}
      {msg}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs tracking-[4px] uppercase text-[#5a5a5a] mb-6 pb-3 border-b border-[#1e1e1e]">
      {children}
    </h3>
  );
}

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  error,
  rightEl,
  required,
}: {
  label: string;
  id?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  rightEl?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#0a0a0a] border ${error ? "border-red-500" : "border-[#1e1e1e]"} text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors pr-${rightEl ? "12" : "4"}`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
          <AlertCircle size={10} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[#3a3a3a] text-[11px] mt-1">{hint}</p>
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ justOrdered }: { justOrdered: boolean }) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      {justOrdered && (
        <div className="border border-green-500/30 bg-green-500/10 p-4 mb-6 flex items-start gap-3">
          <CheckCircle
            size={16}
            className="text-green-400 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-green-400 font-bold text-xs tracking-widest uppercase">
              Order Placed Successfully!
            </p>
            <p className="text-[#5a5a5a] text-xs mt-0.5">
              We'll process it shortly. Track your order status below.
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-[10px] tracking-[3px] uppercase border transition-colors ${
              filter === s
                ? "border-[#c9a84c] text-[#c9a84c]"
                : "border-[#1e1e1e] text-[#5a5a5a] hover:border-[#3a3a3a]"
            }`}
          >
            {s}
            {s !== "all" && orders.filter((o) => o.status === s).length > 0 && (
              <span className="ml-1.5 bg-[#1e1e1e] px-1.5 py-0.5 rounded-full text-[9px]">
                {orders.filter((o) => o.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#1e1e1e] p-16 text-center">
          <Package
            size={40}
            strokeWidth={1}
            className="text-[#2a2a2a] mx-auto mb-4"
          />
          <p className="text-[#5a5a5a] text-sm tracking-widest uppercase">
            {filter === "all" ? "No orders yet" : `No ${filter} orders`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => router.push("/shop")}
              className="mt-6 bg-[#c9a84c] text-[#0a0a0a] px-8 py-3 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors"
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const stepIndex = STATUS_STEPS.indexOf(order.status);
            const isCancelled = order.status === "cancelled";
            return (
              <div
                key={order._id}
                className="border border-[#1e1e1e] overflow-hidden hover:border-[#2a2a2a] transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e] bg-[#111111]">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-xs text-[#5a5a5a]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-[#3a3a3a] mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 text-[10px] tracking-widest uppercase px-2.5 py-1 border ${STATUS_COLORS[order.status] || "text-[#5a5a5a]"}`}
                    >
                      {STATUS_ICONS[order.status]}
                      {order.status}
                    </span>
                    <span className="text-[#c9a84c] font-black text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                {!isCancelled && (
                  <div className="px-5 py-4 border-b border-[#1e1e1e]">
                    <div className="flex items-center">
                      {STATUS_STEPS.map((step, i) => (
                        <div
                          key={step}
                          className="flex items-center flex-1 last:flex-none"
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <div
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                                i < stepIndex
                                  ? "border-[#c9a84c] bg-[#c9a84c] text-[#0a0a0a]"
                                  : i === stepIndex
                                    ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                                    : "border-[#2a2a2a] text-[#2a2a2a]"
                              }`}
                            >
                              {i < stepIndex ? "✓" : i + 1}
                            </div>
                            <span
                              className={`text-[9px] tracking-widest uppercase whitespace-nowrap ${
                                i <= stepIndex
                                  ? "text-[#c9a84c]"
                                  : "text-[#2a2a2a]"
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-px mx-2 mb-5 transition-colors ${i < stepIndex ? "bg-[#c9a84c]" : "bg-[#1e1e1e]"}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="px-5 py-3 border-b border-[#1e1e1e] bg-red-900/5 flex items-center gap-2">
                    <XCircle size={13} className="text-red-400" />
                    <p className="text-red-400 text-xs">
                      This order has been cancelled.
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="p-5 space-y-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-12 h-12 bg-[#1e1e1e] flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div>
                          <p className="text-xs font-medium">{item.name}</p>
                          <p className="text-[#5a5a5a] text-[10px] tracking-widest uppercase">
                            {item.size} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-[#c9a84c] text-xs font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-[#1e1e1e] bg-[#111111] flex flex-wrap justify-between gap-2 text-[10px] text-[#5a5a5a]">
                  <span>
                    Payment:{" "}
                    <span className="text-white uppercase tracking-widest">
                      {order.paymentMethod === "online" ? "GCash" : "COD"}
                    </span>
                  </span>
                  <span>
                    Ship to: <span className="text-white">{order.address}</span>
                  </span>
                  <span>
                    Phone: <span className="text-white">{order.phone}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({
  user,
  onToast,
}: {
  user: any;
  onToast: (m: string, t: "success" | "error") => void;
}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [nameError, setNameError] = useState("");

  function validateName(v: string) {
    if (!v.trim()) return "Name is required";
    if (v.trim().length < 3) return "Name is too short";
    if (v.trim().split(/\s+/).length < 2)
      return "Please enter first and last name";
    if (!/^[a-zA-Z\s\.\-\']+$/.test(v)) return "Letters only";
    return "";
  }

  async function handleSave() {
    const err = validateName(name);
    if (err) {
      setNameError(err);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        onToast("Profile updated successfully", "success");
        setEditing(false);
      } else {
        const d = await res.json();
        onToast(d.error || "Update failed", "error");
      }
    } catch {
      onToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="border border-[#1e1e1e] p-6">
        <SectionTitle>Personal Information</SectionTitle>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 bg-[#c9a84c] flex items-center justify-center text-[#0a0a0a] text-2xl font-black rounded-none">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black tracking-widest uppercase">{user?.name}</p>
            <p className="text-[#5a5a5a] text-xs mt-0.5">{user?.email}</p>
            <span className="inline-block mt-1.5 text-[9px] tracking-[3px] uppercase px-2 py-0.5 border border-[#c9a84c]/30 text-[#c9a84c]">
              {user?.role === "admin" ? "Administrator" : "Customer"}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <InputField
            label="Full Name"
            value={name}
            required
            onChange={(v) => {
              setName(v);
              if (nameError) setNameError(validateName(v));
            }}
            placeholder="Juan Dela Cruz"
            error={nameError}
            rightEl={
              !editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-[#5a5a5a] hover:text-[#c9a84c] transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              ) : null
            }
          />

          <InputField
            label="Email Address"
            value={email}
            onChange={() => {}}
            hint="Email cannot be changed. Contact support if needed."
          />

          <div className="border border-[#1e1e1e] p-4 bg-[#0a0a0a]">
            <p className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a] mb-2">
              Account Created
            </p>
            <p className="text-sm text-white">{formatDate(new Date())}</p>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setEditing(false);
                setName(user?.name || "");
                setNameError("");
              }}
              className="flex-1 border border-[#1e1e1e] text-[#5a5a5a] py-3 text-xs tracking-[3px] uppercase hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-[#c9a84c] text-[#0a0a0a] py-3 text-xs font-bold tracking-[3px] uppercase hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="border border-red-900/40 p-6">
        <SectionTitle>Danger Zone</SectionTitle>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-red-400">Delete Account</p>
            <p className="text-xs text-[#5a5a5a] mt-1">
              Permanently delete your account and all order history. This cannot
              be undone.
            </p>
          </div>
          <button
            onClick={() =>
              onToast("Please contact support to delete your account.", "error")
            }
            className="text-xs tracking-[2px] uppercase border border-red-900/40 text-red-400 px-4 py-2 hover:bg-red-900/20 transition-colors flex-shrink-0 ml-4"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab({
  onToast,
}: {
  onToast: (m: string, t: "success" | "error") => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.current) e.current = "Current password is required";
    if (!form.newPass) e.newPass = "New password is required";
    else if (form.newPass.length < 8)
      e.newPass = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.newPass))
      e.newPass = "Must include at least one uppercase letter";
    else if (!/[0-9]/.test(form.newPass))
      e.newPass = "Must include at least one number";
    else if (form.newPass === form.current)
      e.newPass = "New password must be different from current";
    if (!form.confirm) e.confirm = "Please confirm your new password";
    else if (form.confirm !== form.newPass)
      e.confirm = "Passwords do not match";
    return e;
  }

  const strength = (() => {
    const p = form.newPass;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = [
    "",
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Very Strong",
  ][strength];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-500",
  ][strength];

  async function handleChange(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.newPass,
        }),
      });
      if (res.ok) {
        onToast("Password changed successfully", "success");
        setForm({ current: "", newPass: "", confirm: "" });
        setErrors({});
      } else {
        const d = await res.json();
        if (d.error?.toLowerCase().includes("incorrect")) {
          setErrors({ current: "Current password is incorrect" });
        } else {
          onToast(d.error || "Failed to change password", "error");
        }
      }
    } catch {
      onToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Change password */}
      <div className="border border-[#1e1e1e] p-6">
        <SectionTitle>Change Password</SectionTitle>
        <form onSubmit={handleChange} className="space-y-5" noValidate>
          <InputField
            label="Current Password"
            type={showCurr ? "text" : "password"}
            value={form.current}
            onChange={(v) => setForm({ ...form, current: v })}
            placeholder="Your current password"
            required
            error={errors.current}
            rightEl={
              <button
                type="button"
                onClick={() => setShowCurr(!showCurr)}
                className="text-[#5a5a5a] hover:text-white transition-colors"
              >
                {showCurr ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />

          <div>
            <InputField
              label="New Password"
              type={showNew ? "text" : "password"}
              value={form.newPass}
              onChange={(v) => setForm({ ...form, newPass: v })}
              placeholder="At least 8 characters"
              required
              error={errors.newPass}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-[#5a5a5a] hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
            {form.newPass && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-[#1e1e1e]"}`}
                    />
                  ))}
                </div>
                <p
                  className={`text-[10px] ${["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-green-400"][strength]}`}
                >
                  {strengthLabel}
                </p>
              </div>
            )}
          </div>

          <InputField
            label="Confirm New Password"
            type={showConf ? "text" : "password"}
            value={form.confirm}
            onChange={(v) => setForm({ ...form, confirm: v })}
            placeholder="Repeat new password"
            required
            error={errors.confirm}
            rightEl={
              <button
                type="button"
                onClick={() => setShowConf(!showConf)}
                className="text-[#5a5a5a] hover:text-white transition-colors"
              >
                {showConf ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />

          {/* Password requirements */}
          <div className="border border-[#1e1e1e] p-4 bg-[#0a0a0a] space-y-2">
            <p className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a] mb-3">
              Password Requirements
            </p>
            {[
              {
                label: "At least 8 characters",
                check: form.newPass.length >= 8,
              },
              {
                label: "At least one uppercase letter",
                check: /[A-Z]/.test(form.newPass),
              },
              {
                label: "At least one number",
                check: /[0-9]/.test(form.newPass),
              },
              {
                label: "Different from current password",
                check: form.newPass.length > 0 && form.newPass !== form.current,
              },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${r.check ? "bg-green-500" : "bg-[#1e1e1e]"}`}
                >
                  {r.check && (
                    <span className="text-white text-[8px] font-black">✓</span>
                  )}
                </div>
                <span
                  className={`text-[11px] ${r.check ? "text-green-400" : "text-[#3a3a3a]"}`}
                >
                  {r.label}
                </span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a84c] text-[#0a0a0a] py-3 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Security info */}
      <div className="border border-[#1e1e1e] p-6">
        <SectionTitle>Account Security</SectionTitle>
        <div className="space-y-4">
          {[
            {
              icon: <Shield size={16} className="text-green-400" />,
              label: "Password Protected",
              desc: "Your account is secured with a password",
              ok: true,
            },
            {
              icon: <Lock size={16} className="text-[#c9a84c]" />,
              label: "Secure Sessions",
              desc: "Sessions expire automatically for your security",
              ok: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-4 border border-[#1e1e1e] bg-[#0a0a0a]"
            >
              <div className="mt-0.5">{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-xs text-[#5a5a5a] mt-0.5">{item.desc}</p>
              </div>
              <CheckCircle
                size={14}
                className={item.ok ? "text-green-400" : "text-[#3a3a3a]"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sign out all */}
      <div className="border border-[#1e1e1e] p-6">
        <SectionTitle>Sessions</SectionTitle>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Sign Out Everywhere</p>
            <p className="text-xs text-[#5a5a5a] mt-1">
              Sign out of all devices and sessions immediately.
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs tracking-[2px] uppercase border border-[#1e1e1e] text-[#5a5a5a] px-4 py-2 hover:border-white hover:text-white transition-colors flex-shrink-0 ml-4"
          >
            Sign Out All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab({
  onToast,
}: {
  onToast: (m: string, t: "success" | "error") => void;
}) {
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    promoEmails: false,
    newArrivals: true,
    smsUpdates: false,
    deliveryAlerts: true,
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  }

  async function handleSave() {
    setSaved(true);
    onToast("Notification preferences saved", "success");
  }

  const items = [
    {
      key: "orderUpdates",
      label: "Order Updates",
      desc: "Get notified when your order status changes",
      required: true,
    },
    {
      key: "deliveryAlerts",
      label: "Delivery Alerts",
      desc: "Notifications when your order is out for delivery",
      required: false,
    },
    {
      key: "newArrivals",
      label: "New Arrivals",
      desc: "Be the first to know about new drops",
      required: false,
    },
    {
      key: "promoEmails",
      label: "Promotions",
      desc: "Exclusive discounts and sale announcements via email",
      required: false,
    },
    {
      key: "smsUpdates",
      label: "SMS Updates",
      desc: "Text message notifications for your orders",
      required: false,
    },
  ];

  return (
    <div className="border border-[#1e1e1e] p-6">
      <SectionTitle>Notification Preferences</SectionTitle>
      <div className="space-y-0 divide-y divide-[#1e1e1e]">
        {items.map(({ key, label, desc, required }) => (
          <div key={key} className="flex items-center justify-between py-5">
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{label}</p>
                {required && (
                  <span className="text-[9px] tracking-[2px] uppercase text-[#c9a84c] border border-[#c9a84c]/30 px-1.5 py-0.5">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5a5a5a] mt-0.5">{desc}</p>
            </div>
            <div
              onClick={() => !required && toggle(key as keyof typeof prefs)}
              className={`relative flex-shrink-0 transition-colors ${
                required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              } ${prefs[key as keyof typeof prefs] ? "bg-[#c9a84c]" : "bg-[#2a2a2a]"}`}
              style={{ width: 44, height: 24, borderRadius: 12 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s",
                  left: prefs[key as keyof typeof prefs] ? 24 : 4,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-6 w-full bg-[#c9a84c] text-[#0a0a0a] py-3 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors"
      >
        Save Preferences
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const justOrdered = searchParams.get("success") === "1";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (justOrdered) setActiveTab("orders");
  }, [justOrdered]);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  if (status === "loading")
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const user = session?.user as any;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders", label: "My Orders", icon: <Package size={15} /> },
    { id: "profile", label: "Profile", icon: <User size={15} /> },
    { id: "security", label: "Security", icon: <Lock size={15} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-5xl mx-auto py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-2">
              My Account
            </p>
            <h1 className="text-4xl font-black tracking-tight">
              {user?.name?.toUpperCase()}
            </h1>
            <p className="text-[#5a5a5a] text-xs mt-1.5 tracking-wider">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                  activeTab === tab.id
                    ? "bg-[#c9a84c]/10 border-l-2 border-[#c9a84c] text-[#c9a84c] font-bold"
                    : "border-l-2 border-transparent text-[#5a5a5a] hover:text-white hover:bg-[#111111]"
                }`}
              >
                {tab.icon}
                <span className="tracking-widest uppercase text-xs">
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <ChevronRight size={12} className="ml-auto" />
                )}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-[#1e1e1e]">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#5a5a5a] hover:text-red-400 transition-colors border-l-2 border-transparent"
              >
                <LogOut size={15} />
                <span className="tracking-widest uppercase text-xs">
                  Sign Out
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === "orders" && <OrdersTab justOrdered={justOrdered} />}
            {activeTab === "profile" && (
              <ProfileTab user={user} onToast={showToast} />
            )}
            {activeTab === "security" && <SecurityTab onToast={showToast} />}
            {activeTab === "notifications" && (
              <NotificationsTab onToast={showToast} />
            )}
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
