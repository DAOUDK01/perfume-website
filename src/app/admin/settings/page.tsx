"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [storeName, setStoreName] = useState("e&apos;eora");
  const [supportEmail, setSupportEmail] = useState("support@example.com");
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load settings");
        const s = data.settings || {};
        setStoreName(s.storeName || "e&apos;eora");
        setSupportEmail(s.supportEmail || "support@example.com");
        setCurrency(s.currency || "USD");
      } catch (e: any) {
        setError(e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, supportEmail, currency }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to save settings");
      setMessage("Settings saved.");
    } catch (e: any) {
      setError(e?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-serif font-light text-gray-900">Settings</h1>
        <p className="text-gray-600 font-light mt-1">Configure your store details</p>
      </div>

      <form className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6" onSubmit={onSubmit}>
        {loading ? <p className="text-sm text-gray-600">Loading…</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-600">{message}</p> : null}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Support email</label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-light text-lg disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}

