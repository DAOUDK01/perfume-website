"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Image as ImageIcon, Save, X } from "lucide-react";
import Button from "@/src/components/Button";

interface ContentItem {
  _id: string;
  label: string;
  page: string;
  section: string;
  type: "image" | "text";
  value: string;
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of item being edited
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    label: "",
    page: "About",
    section: "Hero",
    type: "image",
    value: "",
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (res.ok) {
        setContent(data.content || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/content/${isEditing}` : "/api/admin/content";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setFormData({ label: "", page: "About", section: "Hero", type: "image", value: "" });
        fetchContent();
      } else {
        alert("Failed to save content");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving content");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchContent();
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const startEdit = (item: ContentItem) => {
    setFormData({
      label: item.label,
      page: item.page,
      section: item.section,
      type: item.type as any,
      value: item.value,
    });
    setIsEditing(item._id);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({ label: "", page: "About", section: "Hero", type: "image", value: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-light text-gray-900">Site Content</h1>
          <p className="text-gray-600 font-light mt-1">Manage images and text for various pages.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-medium mb-4">{isEditing ? "Edit Content" : "Add New Content"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. About Hero Image"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                <select
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="About">About</option>
                  <option value="Journal">Journal</option>
                  <option value="Contact">Contact</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  placeholder="e.g. Hero, Footer, Banner"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="image">Image</option>
                  <option value="text">Text</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value (URL or Text)</label>
              <input
                type="text"
                required
                placeholder="https://..."
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
              />
              {formData.type === "image" && formData.value && (
                <div className="mt-2 h-32 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                  <img src={formData.value} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading content...</div>
        ) : content.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No content found. Click "Add Content" to start.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page / Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {content.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.type === "image" ? (
                        <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden bg-white">
                          <img src={item.value} alt={item.label} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          Text
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600 mr-2">{item.page}</span>
                      <span className="text-sm text-gray-500">{item.section}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
