"use client";
import { useEffect, useState } from "react";
import {
  UserPlus,
  Trash2,
  Bike,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Rider {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

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

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchRiders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/riders");
      const data = await res.json();
      setRiders(data);
    } catch {
      showToast("Failed to load riders", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRiders();
  }, []);

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Valid email required";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/riders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to create rider", "error");
        return;
      }
      showToast(`Rider "${data.name}" created`, "success");
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchRiders();
    } catch {
      showToast("Server error", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(rider: Rider) {
    if (
      !confirm(
        `Remove rider "${rider.name}"? They will no longer be able to log in.`,
      )
    )
      return;
    setDeletingId(rider._id);
    try {
      const res = await fetch(`/api/admin/riders/${rider._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Failed to delete rider", "error");
        return;
      }
      showToast(`Rider "${rider.name}" removed`, "success");
      setRiders((prev) => prev.filter((r) => r._id !== rider._id));
    } catch {
      showToast("Server error", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] mb-1">
              Management
            </p>
            <h1 className="text-2xl font-black tracking-tight">
              Delivery Riders
            </h1>
            <p className="text-[#5a5a5a] text-sm mt-1">
              {riders.length} rider{riders.length !== 1 ? "s" : ""} registered
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setErrors({});
            }}
            className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] font-bold text-xs tracking-[2px] uppercase px-5 py-2.5 hover:bg-[#f0d080] transition-colors cursor-pointer"
          >
            <UserPlus size={15} />
            Add Rider
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-[#111] border border-[#1e1e1e] p-6 mb-6">
            <h2 className="text-xs tracking-[4px] uppercase text-[#5a5a5a] mb-5 pb-3 border-b border-[#1e1e1e]">
              New Rider Account
            </h2>
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Name */}
              <div>
                <label className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a] block mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Juan dela Cruz"
                  className={`w-full bg-[#0a0a0a] border px-3 py-2.5 text-sm text-white placeholder-[#3a3a3a] focus:outline-none focus:border-[#c9a84c]/50 transition-colors ${
                    errors.name ? "border-red-500/50" : "border-[#1e1e1e]"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a] block mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="rider@email.com"
                  className={`w-full bg-[#0a0a0a] border px-3 py-2.5 text-sm text-white placeholder-[#3a3a3a] focus:outline-none focus:border-[#c9a84c]/50 transition-colors ${
                    errors.email ? "border-red-500/50" : "border-[#1e1e1e]"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a] block mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Min. 6 characters"
                    className={`w-full bg-[#0a0a0a] border px-3 py-2.5 pr-10 text-sm text-white placeholder-[#3a3a3a] focus:outline-none focus:border-[#c9a84c]/50 transition-colors ${
                      errors.password ? "border-red-500/50" : "border-[#1e1e1e]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3a3a] hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <div className="md:col-span-3 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#c9a84c] text-[#0a0a0a] font-bold text-xs tracking-[2px] uppercase px-6 py-2.5 hover:bg-[#f0d080] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Creating..." : "Create Rider Account"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                    setForm({ name: "", email: "", password: "" });
                  }}
                  className="border border-[#1e1e1e] text-[#5a5a5a] hover:text-white text-xs tracking-[2px] uppercase px-6 py-2.5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Riders table */}
        <div className="bg-[#111] border border-[#1e1e1e]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-[#3a3a3a] text-sm">
              Loading riders...
            </div>
          ) : riders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#3a3a3a]">
              <Bike size={32} strokeWidth={1} />
              <p className="text-sm">No riders yet. Add one to get started.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  <th className="text-left text-[10px] tracking-[3px] uppercase text-[#3a3a3a] px-5 py-3">
                    Name
                  </th>
                  <th className="text-left text-[10px] tracking-[3px] uppercase text-[#3a3a3a] px-5 py-3 hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left text-[10px] tracking-[3px] uppercase text-[#3a3a3a] px-5 py-3 hidden md:table-cell">
                    Added
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {riders.map((rider, i) => (
                  <tr
                    key={rider._id}
                    className={`border-b border-[#1e1e1e] last:border-0 hover:bg-[#0a0a0a]/50 transition-colors ${
                      i % 2 === 0 ? "" : "bg-[#0a0a0a]/20"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#c9a84c] text-xs font-bold">
                            {rider.name[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {rider.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5a5a5a] hidden md:table-cell">
                      {rider.email}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#3a3a3a] hidden md:table-cell">
                      {new Date(rider.createdAt).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(rider)}
                        disabled={deletingId === rider._id}
                        className="p-2 text-[#3a3a3a] hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-40 cursor-pointer"
                        title="Remove rider"
                      >
                        {deletingId === rider._id ? (
                          <span className="text-xs text-[#5a5a5a]">...</span>
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-[#3a3a3a] text-xs mt-4">
          Riders can log in at <span className="text-[#5a5a5a]">/login</span>{" "}
          and will be taken to their delivery portal automatically.
        </p>
      </div>
    </div>
  );
}
