"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatMoney(value: number, currency: string) {
  const code = (currency || "PKR").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Rs ${Math.round(value)}`;
  }
}

function formatDate(value: any) {
  try {
    const d = new Date(value);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return String(value || "");
  }
}

const STATUSES = [
  "new",
  "processing",
  "shipped",
  "delivered",
  "complete",
  "cancelled",
] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [currency, setCurrency] = useState("PKR");

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders)
      map[o?.status || "new"] = (map[o?.status || "new"] || 0) + 1;
    return map;
  }, [orders]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/orders", window.location.origin);
      if (q.trim()) url.searchParams.set("q", q.trim());
      if (status) url.searchParams.set("status", status);
      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load orders");
      setOrders(data.orders || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadCurrency() {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        if (data?.settings?.currency) setCurrency(data.settings.currency);
      } catch {
        // ignore
      }
    }
    loadCurrency();
  }, []);

  async function onUpdateStatus(orderId: string, next: string) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "Failed to update status");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light text-gray-900">
            Orders
          </h1>
          <p className="text-gray-600 font-light mt-1">
            View and update customer orders
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by customer/email…"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} ({statusCounts[s] || 0})
                </option>
              ))}
            </select>
            <button
              onClick={load}
              className="px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
            >
              Apply
            </button>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-600" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-gray-600" colSpan={5}>
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((o, index) => (
                  <tr
                    key={`${o?._id?.toString?.() || "order"}-${o?.createdAt || "na"}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{String(o._id).slice(-6)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(o.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {o.customerName}
                      </div>
                      <div className="text-sm text-gray-500">{o.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatMoney(Number(o.totalAmount || 0), currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-xs rounded-full text-gray-800 font-medium">
                        {o.status || "new"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/orders/${encodeURIComponent(o._id)}`}
                          className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          View
                        </Link>
                        <select
                          value={o.status || "new"}
                          onChange={(e) =>
                            onUpdateStatus(o._id, e.target.value)
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
