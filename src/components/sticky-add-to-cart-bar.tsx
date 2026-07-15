"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Price } from "@/components/price";

export function StickyAddToCartBar({
  productId,
  name,
  priceCents,
  imageUrl,
  sentinelId,
}: {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  sentinelId: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelId]);

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed bottom-16 inset-x-0 z-30 bg-surface border-t border-line px-4 py-3 flex items-center justify-between gap-3">
      <div>
        <p className="font-serif text-sm text-ink truncate max-w-[140px]">{name}</p>
        <p className="text-sm"><Price priceCents={priceCents} /></p>
      </div>
      <button
        onClick={() => {
          addItem({ productId, name, priceCents, imageUrl });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="bg-gold text-canvas px-5 py-3 text-sm uppercase tracking-[0.12em] hover:bg-gold-deep transition-colors"
      >
        {added ? "已加入" : "加入购物车"}
      </button>
    </div>
  );
}
