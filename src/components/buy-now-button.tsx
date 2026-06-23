"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BuyNowButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuyNow() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ productId, quantity: 1 }] }),
    });

    if (res.status === 401) {
      router.push(`/login?callbackUrl=/products`);
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

  return (
    <div>
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="w-full border border-gold text-gold rounded px-4 py-2 tracking-wide hover:bg-gold hover:text-ivory-light transition-colors disabled:opacity-50"
      >
        {loading ? "跳转中… Redirecting…" : "立即购买 Buy now"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
