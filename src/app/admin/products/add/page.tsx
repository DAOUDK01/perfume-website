"use client";

import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function csvToArray(input: string) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AddProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState<number>(150);
  const [stock, setStock] = useState<number>(10);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          tagline,
          price,
          stock,
          category,
          image: images[0] || "",
          images: images.filter(Boolean),
          topNotes: csvToArray(topNotes),
          heartNotes: csvToArray(heartNotes),
          baseNotes: csvToArray(baseNotes),
          fullDescription,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to create product");
      router.push("/admin/products");
    } catch (err: any) {
      setError(err?.message || "Failed to create product");
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
        <h1 className="text-3xl font-serif font-light mb-2">Add New Product</h1>
        <p className="text-gray-600 font-light mb-8">Create a fragrance that appears in your store.</p>

        <form className="space-y-6" onSubmit={onSubmit}>
          {error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product ID (slug)</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. essence-noir"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
              placeholder="Short marketing line"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                min={1}
                step={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                min={0}
                step={1}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                placeholder="Woody / Fresh / Floral ..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={img}
                    onChange={(e) => {
                      const newImages = [...images];
                      newImages[idx] = e.target.value;
                      setImages(newImages);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                    placeholder={idx === 0 ? "Primary Image URL (required)" : "Additional Image URL"}
                    required={idx === 0}
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setImages([...images, ""])}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium px-2 py-1"
              >
                <Plus className="w-4 h-4" />
                Add Another Image
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Top Notes (comma separated)</label>
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
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black min-h-[120px]"
            />
          </div>

          <button
            disabled={saving}
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-light text-lg disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
