"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function arrayToCsv(arr: any) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "";
}

function csvToArray(input: string) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState<number>(150);
  const [stock, setStock] = useState<number>(10);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  const id = params.id;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load product");
        const p = data.product;
        setName(p?.name || "");
        setTagline(p?.tagline || "");
        setPrice(Number(p?.price || 0));
        setStock(Number(p?.stock || 0));
        setCategory(p?.category || "");
        setImage(p?.image || "");
        setTopNotes(arrayToCsv(p?.topNotes));
        setHeartNotes(arrayToCsv(p?.heartNotes));
        setBaseNotes(arrayToCsv(p?.baseNotes));
        setFullDescription(p?.fullDescription || "");
      } catch (e: any) {
        setError(e?.message || "Failed to load product");
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
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          price,
          stock,
          category,
          image,
          topNotes: csvToArray(topNotes),
          heartNotes: csvToArray(heartNotes),
          baseNotes: csvToArray(baseNotes),
          fullDescription,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to update product");
      router.push("/admin/products");
    } catch (e: any) {
      setError(e?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-3xl">
        <h1 className="text-3xl font-serif font-light mb-2">Edit Product</h1>
        <p className="text-gray-600 font-light mb-8">
          ID: <span className="font-mono text-gray-900">{id}</span>
        </p>

        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : (
          <form className="space-y-6" onSubmit={onSubmit}>
            {error ? (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" min={1} step={1} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" min={0} step={1} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Top Notes</label>
                <input value={topNotes} onChange={(e) => setTopNotes(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heart Notes</label>
                <input value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Notes</label>
                <input value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black min-h-[120px]" />
            </div>

            <button disabled={saving} className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-light text-lg disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

