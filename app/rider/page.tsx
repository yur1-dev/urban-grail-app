"use client";
import { useEffect, useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronDown,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Settings2,
  X,
  Bike,
  Image as ImageIcon,
} from "lucide-react";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  pending: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    icon: <Clock size={11} />,
  },
  processing: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    icon: <Settings2 size={11} />,
  },
  shipped: {
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/30",
    icon: <Truck size={11} />,
  },
  delivered: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    icon: <CheckCircle2 size={11} />,
  },
  cancelled: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    icon: <XCircle size={11} />,
  },
};

interface Rider {
  _id: string;
  name: string;
  email: string;
}

function ProofModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#1e1e1e] max-w-lg w-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-xs tracking-[3px] uppercase text-[#5a5a5a]">
            Delivery Proof Photo
          </h2>
          <button
            onClick={onClose}
            className="text-[#3a3a3a] hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4">
          <img
            src={url}
            alt="Delivery proof"
            className="w-full object-contain max-h-96 border border-[#1e1e1e]"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center text-xs tracking-[2px] uppercase text-[#c9a84c] hover:text-white transition-colors cursor-pointer"
          >
            Open Full Size ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/admin/riders").then((r) => r.json()),
    ])
      .then(([ordersData, ridersData]) => {
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setRiders(Array.isArray(ridersData) ? ridersData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o)),
        );
        showToast(`Order updated to ${status}`, "success");
      } else {
        showToast("Failed to update order", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setUpdating(null);
    }
  }

  async function assignRider(orderId: string, riderId: string) {
    setAssigning(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedRider: riderId || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, assignedRider: updated.assignedRider }
              : o,
          ),
        );
        showToast(riderId ? "Rider assigned" : "Rider unassigned", "success");
      } else {
        showToast("Failed to assign rider", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setAssigning(null);
    }
  }

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch =
      !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  if (loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      {proofUrl && (
        <ProofModal url={proofUrl} onClose={() => setProofUrl(null)} />
      )}

      <div className="max-w-7xl mx-auto py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[5px] text-[#c9a84c] uppercase mb-2">
              Admin
            </p>
            <h1 className="text-5xl font-black tracking-tight">ORDERS</h1>
            <p className="text-[#5a5a5a] text-xs mt-2">
              {orders.length} total orders · {formatPrice(totalRevenue)} total
              revenue
            </p>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = orders.filter((o) => o.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? "all" : s)}
                className={`border p-4 text-left transition-all cursor-pointer ${
                  filter === s
                    ? `${cfg.border} ${cfg.bg}`
                    : "border-[#1e1e1e] hover:border-[#2a2a2a]"
                }`}
              >
                <div className={`flex items-center gap-1.5 mb-2 ${cfg.color}`}>
                  {cfg.icon}
                  <span className="text-[10px] tracking-[2px] uppercase font-bold">
                    {s}
                  </span>
                </div>
                <p
                  className={`text-2xl font-black ${filter === s ? cfg.color : "text-white"}`}
                >
                  {count}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a3a3a]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name or email..."
              className="w-full bg-[#111111] border border-[#1e1e1e] text-white pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5a5a5a] border border-[#1e1e1e] px-4 py-3">
            <Filter size={13} />
            <span className="tracking-widest uppercase">
              {filter === "all" ? "All Orders" : filter} · {filtered.length}{" "}
              results
            </span>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="ml-2 text-[#c9a84c] hover:text-white transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#1e1e1e] overflow-hidden">
          <div className="hidden md:grid grid-cols-[120px_1fr_110px_90px_150px_150px_90px_60px] gap-3 px-5 py-3 border-b border-[#1e1e1e] bg-[#111111]">
            {[
              "Order ID",
              "Customer",
              "Total",
              "Payment",
              "Status",
              "Rider",
              "Date",
              "",
            ].map((h) => (
              <p
                key={h}
                className="text-[10px] tracking-[3px] uppercase text-[#3a3a3a]"
              >
                {h}
              </p>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Package
                size={36}
                strokeWidth={1}
                className="text-[#2a2a2a] mx-auto mb-3"
              />
              <p className="text-[#3a3a3a] text-xs tracking-widest uppercase">
                No orders found
              </p>
              {(search || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 text-[10px] tracking-[2px] uppercase text-[#c9a84c] hover:text-white transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#1e1e1e]">
              {filtered.map((order) => {
                const cfg =
                  STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const isExpanded = expanded === order._id;
                const isUpdating = updating === order._id;
                const isAssigning = assigning === order._id;
                const assignedRiderId =
                  typeof order.assignedRider === "object"
                    ? order.assignedRider?._id
                    : order.assignedRider;

                return (
                  <div key={order._id}>
                    {/* Main row */}
                    <div
                      className="grid grid-cols-1 md:grid-cols-[120px_1fr_110px_90px_150px_150px_90px_60px] gap-3 px-5 py-4 hover:bg-[#111111] transition-colors items-center cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : order._id)}
                    >
                      <p className="font-mono text-[11px] text-[#5a5a5a]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div>
                        <p className="text-sm font-medium">
                          {order.user?.name || "N/A"}
                        </p>
                        <p className="text-[11px] text-[#5a5a5a]">
                          {order.user?.email || ""}
                        </p>
                      </div>
                      <p className="text-[#c9a84c] font-black text-sm">
                        {formatPrice(order.total)}
                      </p>
                      <span className="text-[11px] text-[#5a5a5a] uppercase tracking-wider">
                        {order.paymentMethod === "online" ||
                        order.paymentMethod === "gcash"
                          ? "📱 GCash"
                          : "💵 COD"}
                      </span>

                      {/* Status dropdown */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            disabled={isUpdating}
                            className={`w-full appearance-none text-[11px] tracking-[2px] uppercase font-bold px-3 py-2 border cursor-pointer focus:outline-none transition-all pr-7 ${cfg.color} ${cfg.bg} ${cfg.border} disabled:opacity-50`}
                          >
                            {STATUSES.map((s) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-[#111111] text-white normal-case"
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={11}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`}
                          />
                          {isUpdating && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/60">
                              <div className="w-3 h-3 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assign Rider dropdown */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            value={assignedRiderId || ""}
                            onChange={(e) =>
                              assignRider(order._id, e.target.value)
                            }
                            disabled={isAssigning}
                            className="w-full appearance-none text-[11px] px-3 py-2 border border-[#1e1e1e] bg-[#0a0a0a] text-[#5a5a5a] cursor-pointer focus:outline-none focus:border-[#c9a84c]/40 transition-all pr-7 disabled:opacity-50"
                          >
                            <option value="">— No rider —</option>
                            {riders.map((r) => (
                              <option
                                key={r._id}
                                value={r._id}
                                className="bg-[#111111] text-white"
                              >
                                {r.name}
                              </option>
                            ))}
                          </select>
                          <Bike
                            size={11}
                            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#3a3a3a]"
                          />
                          {isAssigning && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/60">
                              <div className="w-3 h-3 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#5a5a5a]">
                        {new Date(order.createdAt).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex justify-end items-center gap-2">
                        {order.deliveryProof && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProofUrl(order.deliveryProof);
                            }}
                            className="p-1.5 text-green-400 hover:bg-green-950/30 transition-colors cursor-pointer"
                            title="View delivery proof"
                          >
                            <ImageIcon size={14} />
                          </button>
                        )}
                        <ChevronDown
                          size={14}
                          className={`text-[#3a3a3a] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <div className="px-5 pb-5 bg-[#0a0a0a] border-t border-[#1e1e1e]">
                        <div className="grid md:grid-cols-2 gap-6 pt-5">
                          {/* Order items */}
                          <div>
                            <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-3">
                              Items Ordered
                            </p>
                            <div className="space-y-3">
                              {order.items?.map((item: any, i: number) => (
                                <div
                                  key={i}
                                  className="flex gap-3 items-center"
                                >
                                  <div className="w-12 h-12 bg-[#1e1e1e] flex-shrink-0 overflow-hidden">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-medium">
                                      {item.name}
                                    </p>
                                    <p className="text-[10px] text-[#5a5a5a]">
                                      Size: {item.size} · Qty: {item.quantity} ·{" "}
                                      {formatPrice(item.price)} each
                                    </p>
                                  </div>
                                  <p className="text-[#c9a84c] text-xs font-bold">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery + payment info */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-2">
                                Delivery Details
                              </p>
                              <div className="bg-[#111111] border border-[#1e1e1e] p-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-[#5a5a5a]">
                                    Recipient
                                  </span>
                                  <span className="text-white font-medium">
                                    {order.recipientName ||
                                      order.user?.name ||
                                      "N/A"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-[#5a5a5a]">Phone</span>
                                  <span className="text-white">
                                    {order.phone || "—"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-[#5a5a5a]">
                                    Address
                                  </span>
                                  <span className="text-white text-right max-w-[200px]">
                                    {order.address || "—"}
                                  </span>
                                </div>
                                {order.notes && (
                                  <div className="flex justify-between text-xs">
                                    <span className="text-[#5a5a5a]">
                                      Notes
                                    </span>
                                    <span className="text-white">
                                      {order.notes}
                                    </span>
                                  </div>
                                )}
                                {order.assignedRider && (
                                  <div className="flex justify-between text-xs border-t border-[#1e1e1e] pt-2 mt-2">
                                    <span className="text-[#5a5a5a]">
                                      Assigned Rider
                                    </span>
                                    <span className="text-[#c9a84c] font-medium">
                                      {typeof order.assignedRider === "object"
                                        ? order.assignedRider.name
                                        : riders.find(
                                            (r) =>
                                              r._id === order.assignedRider,
                                          )?.name || "Unknown"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Delivery proof */}
                            {order.deliveryProof && (
                              <div>
                                <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-2">
                                  Delivery Proof
                                </p>
                                <div
                                  className="relative h-32 bg-[#111] border border-[#1e1e1e] overflow-hidden cursor-pointer group"
                                  onClick={() =>
                                    setProofUrl(order.deliveryProof)
                                  }
                                >
                                  <img
                                    src={order.deliveryProof}
                                    alt="Delivery proof"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] tracking-[2px] uppercase text-white">
                                      View Full Photo
                                    </span>
                                  </div>
                                </div>
                                {order.deliveredAt && (
                                  <p className="text-[10px] text-[#3a3a3a] mt-1">
                                    Delivered on{" "}
                                    {new Date(order.deliveredAt).toLocaleString(
                                      "en-PH",
                                    )}
                                  </p>
                                )}
                              </div>
                            )}

                            <div>
                              <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-2">
                                Payment Info
                              </p>
                              <div className="bg-[#111111] border border-[#1e1e1e] p-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-[#5a5a5a]">Method</span>
                                  <span className="text-white uppercase tracking-wider">
                                    {order.paymentMethod === "online" ||
                                    order.paymentMethod === "gcash"
                                      ? "GCash"
                                      : "Cash on Delivery"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-[#5a5a5a]">Status</span>
                                  <span
                                    className={
                                      order.paymentStatus === "paid"
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                    }
                                  >
                                    {order.paymentStatus || "pending"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-[#1e1e1e] pt-2 mt-2">
                                  <span className="text-[#5a5a5a] font-bold">
                                    Total
                                  </span>
                                  <span className="text-[#c9a84c] font-black">
                                    {formatPrice(order.total)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[10px] tracking-widest uppercase text-[#3a3a3a] mt-4 text-right">
          Showing {filtered.length} of {orders.length} orders
          {filter !== "all" && ` · filtered by ${filter}`}
          {search && ` · searching "${search}"`}
        </p>
      </div>

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
