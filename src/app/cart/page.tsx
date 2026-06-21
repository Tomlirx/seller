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
      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">Your cart</h1>
        <p className="text-zinc-500">
          Your cart is empty. <Link href="/" className="underline">Continue shopping</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your cart</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-zinc-600">{formatPrice(item.priceCents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <button
                onClick={() => removeItem(item.productId)}
                className="text-sm text-red-600 underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 text-lg font-medium">
        <span>Total</span>
        <span>{formatPrice(totalCents)}</span>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-black text-white rounded px-4 py-2 mt-6 w-full disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Checkout"}
      </button>
    </main>
  );
}
