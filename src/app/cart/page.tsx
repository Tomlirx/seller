"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { PageContainer } from "@/components/page-container";
import { BotanicalAccent } from "@/components/botanical-accent";
import { TrustBadges } from "@/components/trust-badges";
import { ProductCard } from "@/components/product-card";

type RecommendedProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  imageUrls: string[];
};

export default function CartPage() {
  const router = useRouter();
  const { items, setQuantity, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([]);

  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  useEffect(() => {
    const exclude = items.map((i) => i.productId).join(",");
    fetch(`/api/recommendations${exclude ? `?exclude=${exclude}` : ""}`)
      .then((res) => res.json())
      .then((data) => setRecommended(data.products ?? []))
      .catch(() => setRecommended([]));
  }, [items]);

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
      <main className="flex-1">
        <PageContainer className="py-16 text-center">
          <h1 className="font-serif text-2xl text-ink mb-4">购物袋 · Your Bag</h1>
          <p className="text-ink-soft">
            购物袋是空的 · Your bag is empty.{" "}
            <Link href="/" className="text-gold underline">继续选购 Continue shopping</Link>
          </p>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageContainer className="py-10">
        <div className="flex items-center gap-3 mb-8">
          <BotanicalAccent />
          <h1 className="font-serif text-2xl text-ink">购物袋 · Your Bag</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 border-b border-line pb-4">
                <div className="relative h-20 w-20 flex-shrink-0 bg-ivory-light border border-line rounded overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-ink-soft text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-serif text-ink">{item.name}</p>
                  <p className="text-gold">{formatPrice(item.priceCents)}</p>
                </div>
                <div className="flex items-center border border-line rounded">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-9 flex items-center justify-center text-ink-soft hover:text-gold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-ink">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-9 flex items-center justify-center text-ink-soft hover:text-gold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-red-600 underline"
                >
                  移除 Remove
                </button>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 self-start border border-line rounded p-6 flex flex-col gap-4 h-fit">
            <div className="flex items-center justify-between text-sm text-ink-soft">
              <span>小计 Subtotal</span>
              <span>{formatPrice(totalCents)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-serif text-ink border-t border-line pt-4">
              <span>总计 Total</span>
              <span className="text-gold">{formatPrice(totalCents)}</span>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-gold text-ivory-light rounded px-4 py-2 w-full tracking-wide hover:bg-gold-soft transition-colors disabled:opacity-50"
            >
              {loading ? "跳转中… Redirecting…" : "结算 Checkout"}
            </button>
            <Link
              href="/"
              className="text-center border border-line text-ink-soft rounded px-4 py-2 text-sm hover:border-gold hover:text-gold transition-colors"
            >
              继续购物 Continue shopping
            </Link>
          </div>
        </div>

        {recommended.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-10">
              <p className="font-serif text-2xl text-ink">猜你喜欢</p>
              <p className="text-xs tracking-widest text-ink-soft mt-2">YOU MAY ALSO LIKE</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-20">
          <TrustBadges
            items={[
              { icon: "mountain", zh: "天然翡翠", en: "NATURAL JADE" },
              { icon: "shield", zh: "严选品质", en: "QUALITY" },
              { icon: "heart", zh: "结缘有缘人", en: "MEANINGFUL" },
            ]}
          />
        </div>
      </PageContainer>
    </main>
  );
}
