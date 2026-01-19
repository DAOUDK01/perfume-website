"use client";
import { BarChart3, Package, Users, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function formatMoney(value: number, currency: string) {
  const code = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    // Fallback for invalid currency codes: just prefix the code without using Intl
    return `${code} ${Math.round(value)}`;
  }
}

function formatDate(value: any) {
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d);
  } catch {
    return String(value || "");
  }
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [metricsRes, settingsRes] = await Promise.all([
          fetch("/api/admin/metrics", { cache: "no-store" }),
          fetch("/api/admin/settings", { cache: "no-store" }),
        ]);

        const metricsData = await metricsRes.json().catch(() => ({}));
        const settingsData = await settingsRes.json().catch(() => ({}));

        if (!metricsRes.ok) throw new Error(metricsData?.error || "Failed to load dashboard");
        if (cancelled) return;

        setMetrics(metricsData.metrics);
        setRecentOrders(metricsData.recentOrders || []);
        if (settingsRes.ok && settingsData?.settings?.currency) {
          setCurrency(settingsData.settings.currency);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      name: "Total Products",
      value: metrics ? String(metrics.productsCount ?? 0) : "—",
      change: "",
      icon: Package,
      color: "from-emerald-500",
    },
    {
      name: "Total Orders",
      value: metrics ? String(metrics.ordersCount ?? 0) : "—",
      change: metrics?.newOrdersCount ? `${metrics.newOrdersCount} new` : "",
      icon: ShoppingCart,
      color: "from-blue-500",
    },
    {
      name: "Total Users",
      value: metrics ? String(metrics.usersCount ?? 0) : "—",
      change: "",
      icon: Users,
      color: "from-purple-500",
    },
    {
      name: "Revenue",
      value: metrics ? formatMoney(Number(metrics.revenue || 0), currency) : "—",
      change: "",
      icon: BarChart3,
      color: "from-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {metrics?.newOrdersCount > 0 ? (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <div>
            <span className="font-medium">{metrics.newOrdersCount} new order{metrics.newOrdersCount > 1 ? "s" : ""}</span>
            <span className="ml-1 text-amber-800">waiting for review.</span>
          </div>
          <Link
            href="/admin/orders"
            className="px-3 py-1.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-medium hover:bg-black transition-colors"
          >
            View orders
          </Link>
        </div>
      ) : null}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 font-light">Welcome back! Here's what's happening with your store.</p>
        </div>
        <Link href="/admin/orders" className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
          View Orders
        </Link>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                {stat.change ? <span className="text-sm text-green-600 font-medium">{stat.change}</span> : <span />}
              </div>
              <div className="mt-6">
                <p className="text-3xl font-serif font-light text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 font-light">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-light">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-gray-700 hover:text-black">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-600">Loading…</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-600">No orders yet.</p>
            ) : (
              recentOrders.map((o) => (
                <Link
                  key={o._id}
                  href={`/admin/orders/${encodeURIComponent(o._id)}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-black rounded-xl flex items-center justify-center">
                      <span className="text-white font-medium">#{String(o._id).slice(-4)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{o.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {formatMoney(Number(o.totalAmount || 0), currency)} • {formatDate(o.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                    {o.status || "new"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-serif font-light mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/products/add" className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors block">➕ Add Product</Link>
            <Link href="/admin/products" className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors block">📦 Manage Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
