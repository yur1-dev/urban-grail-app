"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  processing: "text-blue-400   bg-blue-400/10   border-blue-400/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green-400  bg-green-400/10  border-green-400/20",
  cancelled: "text-red-400    bg-red-400/10    border-red-400/20",
};

const STATUS_ICONS: Record<string, string> = {
  pending: "⏳",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
  trend,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  sub?: string;
  trend?: "up" | "down" | null;
}) {
  const colorMap: Record<string, string> = {
    gold: "text-[#c9a84c] border-[#c9a84c]/20 bg-[#c9a84c]/5",
    blue: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    yellow: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    green: "text-green-400 border-green-400/20 bg-green-400/5",
  };
  const textColor = colorMap[color]?.split(" ")[0] || "text-white";
  const iconClass = colorMap[color] || "";

  return (
    <div className="border border-[#1e1e1e] bg-[#111111] p-6 hover:border-[#2a2a2a] transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a]">
          {label}
        </p>
        <div
          className={`w-8 h-8 flex items-center justify-center border ${iconClass}`}
        >
          <Icon size={14} className={textColor} />
        </div>
      </div>
      <p className={`text-3xl font-black mb-1 ${textColor}`}>{value}</p>
      {sub && (
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && (
            <ArrowUpRight size={11} className="text-green-400" />
          )}
          {trend === "down" && (
            <ArrowDownRight size={11} className="text-red-400" />
          )}
          <p className="text-[10px] text-[#3a3a3a]">{sub}</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    deliveredOrders: 0,
  });
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");

  async function loadData() {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products?limit=100"),
      ]);
      const orders = await ordersRes.json();
      const productsData = await productsRes.json();

      const orderList = Array.isArray(orders) ? orders : [];
      const products = productsData.products || [];

      setAllOrders(orderList);
      setStats({
        totalOrders: orderList.length,
        totalRevenue: orderList
          .filter((o: any) => o.status !== "cancelled")
          .reduce((s: number, o: any) => s + o.total, 0),
        totalProducts: productsData.total || products.length,
        pendingOrders: orderList.filter((o: any) => o.status === "pending")
          .length,
        deliveredOrders: orderList.filter((o: any) => o.status === "delivered")
          .length,
        totalCustomers: new Set(
          orderList.map((o: any) => o.user?._id || o.user),
        ).size,
      });

      setRecentOrders(orderList.slice(0, 10));
      setLowStock(
        products.filter((p: any) => p.stock <= 5 && p.stock > 0).slice(0, 5),
      );
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const filtered =
    orderFilter === "all"
      ? recentOrders
      : recentOrders.filter((o) => o.status === orderFilter);

  const codOrders = allOrders.filter((o) => o.paymentMethod === "cod").length;
  const gcashOrders = allOrders.filter(
    (o) => o.paymentMethod === "online" || o.paymentMethod === "gcash",
  ).length;

  if (loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-24 px-6 pb-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[5px] text-[#c9a84c] uppercase mb-2">
              Admin Panel
            </p>
            <h1 className="text-5xl font-black tracking-tight">DASHBOARD</h1>
            <p className="text-[#5a5a5a] text-xs mt-2 tracking-wider">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 border border-[#1e1e1e] text-[#5a5a5a] hover:text-white hover:border-[#3a3a3a] px-4 py-3 text-[11px] tracking-[2px] uppercase transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <Link
              href="/dashboard/products/new"
              className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-5 py-3 text-[11px] font-black tracking-[3px] uppercase hover:bg-white transition-colors cursor-pointer"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Revenue"
            value={formatPrice(stats.totalRevenue)}
            icon={DollarSign}
            color="gold"
            sub="Excludes cancelled orders"
          />
          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            color="blue"
            sub={`${stats.deliveredOrders} delivered`}
            trend="up"
          />
          <StatCard
            label="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            color="yellow"
            sub="Needs your attention"
            trend={stats.pendingOrders > 0 ? "up" : null}
          />
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="green"
            sub={`${lowStock.length} low on stock`}
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="border border-[#1e1e1e] bg-[#111111] p-5 flex items-center gap-4">
            <div className="w-10 h-10 border border-[#c9a84c]/20 bg-[#c9a84c]/5 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a]">
                Customers
              </p>
              <p className="text-xl font-black text-white">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
          <div className="border border-[#1e1e1e] bg-[#111111] p-5 flex items-center gap-4">
            <div className="w-10 h-10 border border-green-400/20 bg-green-400/5 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💵</span>
            </div>
            <div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a]">
                COD Orders
              </p>
              <p className="text-xl font-black text-white">{codOrders}</p>
            </div>
          </div>
          <div className="border border-[#1e1e1e] bg-[#111111] p-5 flex items-center gap-4">
            <div className="w-10 h-10 border border-blue-400/20 bg-blue-400/5 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <p className="text-[10px] tracking-[3px] uppercase text-[#5a5a5a]">
                GCash Orders
              </p>
              <p className="text-xl font-black text-white">{gcashOrders}</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-4 gap-3 mb-10">
          {[
            {
              label: "Manage Products",
              href: "/dashboard/products",
              desc: "Add, edit, remove items",
              icon: Package,
            },
            {
              label: "Manage Orders",
              href: "/dashboard/orders",
              desc: "View and update order status",
              icon: ShoppingBag,
            },
            {
              label: "Add Product",
              href: "/dashboard/products/new",
              desc: "List a new item in the shop",
              icon: TrendingUp,
            },
            {
              label: "View Shop",
              href: "/shop",
              desc: "See what customers see",
              icon: Eye,
            },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group border border-[#1e1e1e] p-5 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 transition-all duration-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-[#1e1e1e] group-hover:border-[#c9a84c]/30 flex items-center justify-center transition-colors">
                  <l.icon
                    size={15}
                    className="text-[#5a5a5a] group-hover:text-[#c9a84c] transition-colors"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[2px] uppercase group-hover:text-[#c9a84c] transition-colors">
                    {l.label}
                  </p>
                  <p className="text-[10px] text-[#3a3a3a] mt-0.5">{l.desc}</p>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-[#2a2a2a] group-hover:text-[#c9a84c] transition-colors flex-shrink-0"
              />
            </Link>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Orders table */}
          <div className="border border-[#1e1e1e] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e] bg-[#111111]">
              <h2 className="text-sm font-black tracking-[3px] uppercase">
                Recent Orders
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-[10px] tracking-[2px] uppercase text-[#5a5a5a] hover:text-[#c9a84c] transition-colors flex items-center gap-1 cursor-pointer"
              >
                View all <ChevronRight size={11} />
              </Link>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-0 border-b border-[#1e1e1e] overflow-x-auto">
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
                  onClick={() => setOrderFilter(s)}
                  className={`px-4 py-2.5 text-[10px] tracking-[2px] uppercase whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    orderFilter === s
                      ? "border-[#c9a84c] text-[#c9a84c]"
                      : "border-transparent text-[#3a3a3a] hover:text-[#5a5a5a]"
                  }`}
                >
                  {s}
                  {s !== "all" &&
                    allOrders.filter((o) => o.status === s).length > 0 && (
                      <span className="ml-1.5 bg-[#1e1e1e] px-1 py-0.5 rounded text-[9px]">
                        {allOrders.filter((o) => o.status === s).length}
                      </span>
                    )}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#1e1e1e] bg-[#0a0a0a]">
                  <tr>
                    {[
                      "Order",
                      "Customer",
                      "Total",
                      "Payment",
                      "Status",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] tracking-[3px] uppercase text-[#3a3a3a]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-[#3a3a3a] text-xs tracking-widest uppercase"
                      >
                        No {orderFilter === "all" ? "" : orderFilter} orders
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr
                        key={o._id}
                        className="border-b border-[#1e1e1e] hover:bg-[#111111] transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-[11px] text-[#5a5a5a]">
                          #{o._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium">
                            {o.user?.name || "N/A"}
                          </p>
                          <p className="text-[10px] text-[#3a3a3a]">
                            {o.user?.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-[#c9a84c] font-black text-sm">
                          {formatPrice(o.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] tracking-widest uppercase text-[#5a5a5a]">
                            {o.paymentMethod === "online" ||
                            o.paymentMethod === "gcash"
                              ? "📱 GCash"
                              : "💵 COD"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] tracking-widest uppercase px-2 py-0.5 border ${STATUS_COLORS[o.status] || "text-[#5a5a5a]"}`}
                          >
                            {STATUS_ICONS[o.status]} {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#5a5a5a] text-[11px]">
                          {new Date(o.createdAt).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Low stock alert */}
            <div className="border border-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1e1e1e] bg-[#111111]">
                <AlertCircle size={14} className="text-yellow-400" />
                <h3 className="text-sm font-black tracking-[3px] uppercase">
                  Low Stock
                </h3>
              </div>
              {lowStock.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-[#3a3a3a] text-xs tracking-widest uppercase">
                    All stocked up 👍
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1e1e1e]">
                  {lowStock.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <div className="w-9 h-9 bg-[#1e1e1e] flex-shrink-0 overflow-hidden">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{p.name}</p>
                        <p className="text-[10px] text-[#5a5a5a] capitalize">
                          {p.category}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 flex-shrink-0 ${p.stock <= 2 ? "bg-red-900/30 text-red-400" : "bg-yellow-900/30 text-yellow-400"}`}
                      >
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                  <div className="px-5 py-3">
                    <Link
                      href="/dashboard/products"
                      className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Manage inventory <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Order status breakdown */}
            <div className="border border-[#1e1e1e] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e1e1e] bg-[#111111]">
                <h3 className="text-sm font-black tracking-[3px] uppercase">
                  Order Breakdown
                </h3>
                <p className="text-[10px] text-[#3a3a3a] mt-0.5">
                  All {allOrders.length} orders
                </p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: "Pending", key: "pending", color: "bg-yellow-400" },
                  {
                    label: "Processing",
                    key: "processing",
                    color: "bg-blue-400",
                  },
                  { label: "Shipped", key: "shipped", color: "bg-purple-400" },
                  {
                    label: "Delivered",
                    key: "delivered",
                    color: "bg-green-400",
                  },
                  { label: "Cancelled", key: "cancelled", color: "bg-red-400" },
                ].map((item) => {
                  const count = allOrders.filter(
                    (o) => o.status === item.key,
                  ).length;
                  const pct =
                    allOrders.length > 0 ? (count / allOrders.length) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] tracking-[2px] uppercase text-[#5a5a5a]">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-bold text-white">
                          {count}
                        </span>
                      </div>
                      <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick links */}
            <div className="border border-[#1e1e1e] p-5 space-y-2">
              <p className="text-[10px] tracking-[4px] uppercase text-[#3a3a3a] mb-3">
                Quick Links
              </p>
              {[
                { label: "All Products", href: "/dashboard/products" },
                { label: "All Orders", href: "/dashboard/orders" },
                { label: "Add New Product", href: "/dashboard/products/new" },
                { label: "View Storefront", href: "/" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between py-2 text-xs text-[#5a5a5a] hover:text-[#c9a84c] transition-colors border-b border-[#1e1e1e] last:border-0 cursor-pointer"
                >
                  {l.label}
                  <ChevronRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
