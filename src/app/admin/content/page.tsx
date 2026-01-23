"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Image as ImageIcon, Save, X } from "lucide-react";
import Button from "@/src/components/Button";
import { ContentItem } from "@/src/types/content";

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ContentItem>({
    _id: "",
    label: "",
    page: "About",
    section: "Hero",
    type: "image",
    value: "",
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    setLoading(true);
    setError(null);
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
  }

  async function handleSubmit(e: React.FormEvent) {
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
        fetchContent();
        setIsModalOpen(false);
        setFormData({ _id: "", label: "", page: "About", section: "Hero", type: "image", value: "" });
        setIsEditing(null);
      } else {
        alert("Failed to save content");
      }
    } catch (err) {
      alert("Error saving content");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchContent();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting content");
    }
  }

  function openAddModal() {
    setIsEditing(null);
    setFormData({ _id: "", label: "", page: "About", section: "Hero", type: "image", value: "" });
    setIsModalOpen(true);
  }

  function openEditModal(item: ContentItem) {
    setIsEditing(item._id);
    setFormData(item);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-light text-gray-900">Site Content</h1>
          <p className="text-gray-600 font-light mt-1">Manage images and text for various pages.</p>
        </div>
        <Button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 max-w-xl w-full">
            <h2 className="text-lg font-medium mb-4">{isEditing ? "Edit Content" : "Add New Content"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. About Hero Image"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                  <select
                    value={formData.page}
                    onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="About">About</option>
                    <option value="Journal">Journal</option>
                    <option value="Contact">Contact</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g. Hero, Footer, Banner"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "image" | "text" })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                  required
                >
                  <option value="image">Image</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (URL or Text)</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              {formData.type === "image" && formData.value && (
                <div className="mt-2 h-32 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                  <img src={formData.value} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-6">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading content...</div>
        ) : content.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No content found. Click &quot;Add Content&quot; to start.</div>
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
                          <img src={item.value.replace(/"/g, '&quot;')} alt={item.label.replace(/"/g, '&quot;')} className="h-full w-full object-cover" />
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
                        <Button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
