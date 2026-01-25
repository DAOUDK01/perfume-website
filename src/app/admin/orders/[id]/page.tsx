"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

function formatMoney(value: number, currency: string) {
  const code = (currency || "INR").toUpperCase();
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
    return new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(d);
  } catch {
    return String(value || "");
  }
}

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("INR");

  const { id } = use(params);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load order");
        setOrder(data.order);
      } catch (e: any) {
        setError(e?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

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

  async function onDelete() {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "Failed to delete order");
      return;
    }
    router.push("/admin/orders");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <button onClick={onDelete} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        ) : !order ? (
          <p className="text-gray-600">Order not found.</p>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-light text-gray-900">Order</h1>
                <p className="text-gray-600 font-light">
                  #{String(order._id).slice(-6)} • {formatDate(order.createdAt)}
                </p>
              </div>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-900 font-medium">{order.status || "new"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-serif font-light mb-4">Items</h2>
                <div className="space-y-3">
                  {(order.items || []).map((it: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{it.name}</p>
                        <p className="text-sm text-gray-600">
                          {it.quantity} × {formatMoney(Number(it.price || 0), currency)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">{formatMoney(Number(it.price || 0) * Number(it.quantity || 0), currency)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-gray-600">Total</p>
                  <p className="text-xl font-medium text-gray-900">{formatMoney(Number(order.totalAmount || 0), currency)}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-serif font-light mb-2">Customer</h2>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{order.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

