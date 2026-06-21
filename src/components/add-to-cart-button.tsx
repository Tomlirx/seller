"use client";

import { useState } from "react";
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
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem({ productId, name, priceCents, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="bg-black text-white rounded px-4 py-2 w-fit"
    >
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}
