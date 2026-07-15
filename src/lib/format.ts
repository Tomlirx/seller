export function formatPrice(cents: number) {
  return new Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR" }).format(
    cents / 100
  );
}

// Marketing "compare-at" original price: current price ×1.3, rounded UP to
// the nearest RM10 (= 1000 cents). e.g. RM168 → RM220, RM380 → RM500.
export function originalPriceCents(priceCents: number) {
  return Math.ceil((priceCents * 1.3) / 1000) * 1000;
}
