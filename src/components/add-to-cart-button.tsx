"use client";

import { useId, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartButton({
  productId,
  name,
  priceCents,
  imageUrl,
}: {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const stepperId = useId();

  return (
    <div id={stepperId} className="flex items-center gap-3">
      <div className="flex items-center border border-line rounded">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-9 flex items-center justify-center text-ink-soft hover:text-gold"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center text-ink">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="w-8 h-9 flex items-center justify-center text-ink-soft hover:text-gold"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={() => {
          addItem({ productId, name, priceCents, imageUrl }, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex-1 bg-gold text-ivory-light rounded px-4 py-2 tracking-wide hover:bg-gold-soft transition-colors"
      >
        {added ? "已加入 Added!" : "加入购物车 Add to cart"}
      </button>
    </div>
  );
}
