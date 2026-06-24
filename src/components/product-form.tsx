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
  imageUrls: string[];
  stockQty: number;
  isActive: boolean;
  isFeatured: boolean;
};

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<ProductCategoryValue>(initial?.category ?? "OTHER");
  const [price, setPrice] = useState(initial ? (initial.priceCents / 100).toString() : "");
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.imageUrls ?? []);
  const [stockQty, setStockQty] = useState(initial?.stockQty?.toString() ?? "0");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        setUploading(false);
        return;
      }
      uploaded.push(data.url);
    }

    setImageUrls((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImageUrls((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
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
      imageUrls,
      stockQty: parseInt(stockQty, 10),
      isActive,
      isFeatured,
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
        Price (MYR)
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
      <div className="flex flex-col gap-2 text-ink">
        <label className="flex flex-col gap-1">
          Images
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
        </label>
        {uploading && <span className="text-sm text-ink-soft">Uploading…</span>}
        {imageUrls.length > 0 && (
          <p className="text-xs text-ink-soft">First image is used as the storefront thumbnail.</p>
        )}
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((url, index) => (
            <div key={url} className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Image ${index + 1}`} className="h-24 w-24 object-cover rounded border border-line" />
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="text-gold disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === imageUrls.length - 1}
                  className="text-gold disabled:opacity-30"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="text-red-600 underline ml-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-ink">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active (visible in storefront)
      </label>
      <label className="flex items-center gap-2 text-ink">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
        Featured on homepage (甄选珍品)
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
