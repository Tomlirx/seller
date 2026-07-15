import { formatPrice, originalPriceCents } from "@/lib/format";

// Shows a struck-through "original" price (current ×1.3) next to the current
// gold sale price. Font size is inherited from the wrapping element; the
// original is scaled down relative to it.
export function Price({ priceCents }: { priceCents: number }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="line-through text-text-faint text-[0.8em]">
        {formatPrice(originalPriceCents(priceCents))}
      </span>
      <span className="text-gold">{formatPrice(priceCents)}</span>
    </span>
  );
}
