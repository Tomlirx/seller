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
        className="w-full h-[52px] border border-gold/40 text-gold px-4 text-sm uppercase tracking-[0.12em] hover:bg-gold hover:text-canvas hover:border-gold transition-colors disabled:opacity-50"
      >
        {loading ? "跳转中… Redirecting…" : "立即购买 Buy now"}
      </button>
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
}
