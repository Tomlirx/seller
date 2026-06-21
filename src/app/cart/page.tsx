"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();
  const { items, setQuantity, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });

    if (res.status === 401) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Checkout failed");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-16 text-center">
        <h1 className="font-serif text-2xl text-ink mb-4">购物车 · Your Cart</h1>
        <p className="text-ink-soft">
          购物车是空的 · Your cart is empty.{" "}
          <Link href="/" className="text-gold underline">继续选购 Continue shopping</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-10">
      <h1 className="font-serif text-2xl text-ink mb-6">购物车 · Your Cart</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="font-serif text-ink">{item.name}</p>
              <p className="text-gold">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                className="w-16 border border-line bg-ivory-light rounded px-2 py-1 text-ink"
              />
              <button
                onClick={() => removeItem(item.productId)}
                className="text-sm text-red-600 underline"
              >
                移除 Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 text-lg font-serif text-ink">
        <span>总计 Total</span>
        <span className="text-gold">{formatPrice(totalCents)}</span>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-gold text-ivory-light rounded px-4 py-2 mt-6 w-full tracking-wide hover:bg-gold-soft transition-colors disabled:opacity-50"
      >
        {loading ? "跳转中… Redirecting…" : "结算 Checkout"}
      </button>
    </main>
  );
}
