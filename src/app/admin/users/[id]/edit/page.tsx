"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load user");
        const u = data.user;
        setName(u?.name || "");
        setEmail(u?.email || "");
        setRole(u?.role || "admin");
      } catch (e: any) {
        setError(e?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update user");
      router.push("/admin/users");
    } catch (e: any) {
      setError(e?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to users
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-xl">
        <h1 className="text-3xl font-serif font-light mb-2">Edit User</h1>
        <p className="text-gray-600 font-light mb-6">
          ID: <span className="font-mono text-gray-900">{id}</span>
        </p>

        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            {error ? (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-light text-lg disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

