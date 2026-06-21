"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCT_CATEGORIES, type ProductCategoryValue } from "@/lib/categories";

type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategoryValue;
  priceCents: number;
  imageUrl: string | null;
  stockQty: number;
  isActive: boolean;
};

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<ProductCategoryValue>(initial?.category ?? "OTHER");
  const [price, setPrice] = useState(initial ? (initial.priceCents / 100).toString() : "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [stockQty, setStockQty] = useState(initial?.stockQty?.toString() ?? "0");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }
    setImageUrl(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      description,
      category,
      priceCents: Math.round(parseFloat(price) * 100),
      imageUrl,
      stockQty: parseInt(stockQty, 10),
      isActive,
    };

    const res = await fetch(
      initial?.id ? `/api/admin/products/${initial.id}` : "/api/admin/products",
      {
        method: initial?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Delete this product?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
    setSaving(false);
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const inputClass = "border border-line bg-ivory-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <label className="flex flex-col gap-1 text-ink">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-ink">
        Slug
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          pattern="[a-z0-9-]+"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-ink">
        Category
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategoryValue)}
          className={inputClass}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.zh} / {c.en}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-ink">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-ink">
        Price (USD)
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-ink">
        Stock quantity
        <input
          type="number"
          min="0"
          value={stockQty}
          onChange={(e) => setStockQty(e.target.value)}
          required
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-ink">
        Image
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <span className="text-sm text-ink-soft">Uploading…</span>}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded mt-2" />
        )}
      </label>
      <label className="flex items-center gap-2 text-ink">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active (visible in storefront)
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-gold text-ivory-light rounded px-4 py-2 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {initial?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="text-red-600 underline"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
