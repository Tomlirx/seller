"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

interface CategoryConfig {
  id: string;
  category: string;
  imageUrl: string | null;
}

export default function CategoriesAdmin() {
  const [configs, setConfigs] = useState<Map<string, CategoryConfig>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfigs() {
      try {
        const res = await fetch("/api/admin/category-config");
        if (!res.ok) throw new Error("Failed to load configs");
        const data: CategoryConfig[] = await res.json();
        const map = new Map<string, CategoryConfig>(data.map((cfg) => [cfg.category, cfg]));
        setConfigs(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadConfigs();
  }, []);

  const handleImageUrlChange = (category: string, newUrl: string) => {
    const config = configs.get(category) || { id: "", category, imageUrl: null };
    setConfigs(new Map(configs).set(category, { ...config, imageUrl: newUrl || null }));
  };

  const handleSave = async (category: string) => {
    setSaving(category);
    try {
      const config = configs.get(category);
      const res = await fetch("/api/admin/category-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          imageUrl: config?.imageUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setConfigs(new Map(configs).set(category, updated));
    } catch (err) {
      console.error(err);
      alert("保存失败");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-serif mb-8">分类管理</h1>

      <div className="space-y-8">
        {PRODUCT_CATEGORIES.map((cat) => {
          const config = configs.get(cat.value);
          return (
            <div key={cat.value} className="border border-line rounded-lg p-6 bg-white">
              <div className="flex gap-6">
                {/* Preview */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-ivory-light border border-line rounded overflow-hidden flex items-center justify-center">
                    {config?.imageUrl ? (
                      <Image
                        src={config.imageUrl}
                        alt={cat.zh}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-ink-soft text-center">
                        <div className="text-sm mb-2">未设置图片</div>
                        <div className="text-xs">{cat.zh}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form */}
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div>
                    <h2 className="text-xl font-serif mb-2">
                      {cat.zh} {cat.en}
                    </h2>
                    <p className="text-ink-soft text-sm mb-4">{cat.description}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">图片 URL</label>
                    <input
                      type="text"
                      value={config?.imageUrl || ""}
                      onChange={(e) => handleImageUrlChange(cat.value, e.target.value)}
                      placeholder="粘贴图片 URL"
                      className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <p className="text-xs text-ink-soft mt-1">
                      或在 /admin/products 上传图片，复制 Blob URL
                    </p>
                  </div>

                  <button
                    onClick={() => handleSave(cat.value)}
                    disabled={saving === cat.value}
                    className="px-4 py-2 bg-gold text-white rounded text-sm font-medium hover:bg-gold/90 disabled:opacity-50"
                  >
                    {saving === cat.value ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
