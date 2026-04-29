"use client";

import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

function arrayToCsv(arr: any) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "";
}

function csvToArray(input: string) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const CATEGORY_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "uni", label: "Uni (Unisex)" },
] as const;

function normalizeCategoryValue(value: string) {
  const category = (value || "").toLowerCase().trim();

  if (
    category.includes("women") ||
    category.includes("woman") ||
    category.includes("female") ||
    category.includes("lady") ||
    category.includes("for her")
  ) {
    return "women";
  }

  if (
    category.includes("men") ||
    category.includes("man") ||
    category.includes("male") ||
    category.includes("for him")
  ) {
    return "men";
  }

  if (category.includes("uni") || category.includes("unisex")) {
    return "uni";
  }

  return "";
}

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState<number>(150);
  const [stock, setStock] = useState<number>(10);
  const [manualOutOfStock, setManualOutOfStock] = useState(false);
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  const { id } = use(params);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(id)}?includeHidden=true`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load product");
        const p = data.product;
        setName(p?.name || "");
        setTagline(p?.tagline || "");
        setPrice(Number(p?.price || 0));
        setStock(Number(p?.stock || 0));
        setManualOutOfStock(Boolean(p?.manualOutOfStock));
        setShowOnWebsite(p?.showOnWebsite !== false);
        setCategory(normalizeCategoryValue(p?.category || ""));
        if (Array.isArray(p?.images) && p.images.length > 0) {
          setImages(p.images);
        } else if (p?.image) {
          setImages([p.image]);
        } else {
          setImages([""]);
        }
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
          manualOutOfStock,
          showOnWebsite,
          category: normalizeCategoryValue(category),
          image: images[0] || "",
          images: images.filter(Boolean),
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
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
      >
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
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Used by storefront filters: All, Men, Women, Uni.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setManualOutOfStock((value) => !value)}
                className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                  manualOutOfStock
                    ? "border-red-300 bg-red-50 text-red-900"
                    : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <p className="text-sm font-medium">Out of Stock</p>
                <p className="mt-1 text-xs text-gray-500">
                  {manualOutOfStock
                    ? "Manual out-of-stock is enabled."
                    : "Force this fragrance to appear as out of stock."}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setShowOnWebsite((value) => !value)}
                className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                  showOnWebsite
                    ? "border-blue-300 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                <p className="text-sm font-medium">
                  {showOnWebsite ? "Shown on Website" : "Hidden from Website"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {showOnWebsite
                    ? "Customers can see and open this product."
                    : "Hide this product from the storefront."}
                </p>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs
              </label>
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
                      placeholder={
                        idx === 0
                          ? "Primary Image URL (required)"
                          : "Additional Image URL"
                      }
                      required={idx === 0}
                    />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== idx))
                        }
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top Notes
                </label>
                <input
                  value={topNotes}
                  onChange={(e) => setTopNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Notes
                </label>
                <input
                  value={heartNotes}
                  onChange={(e) => setHeartNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Notes
                </label>
                <input
                  value={baseNotes}
                  onChange={(e) => setBaseNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
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
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
