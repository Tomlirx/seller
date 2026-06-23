export function formatPrice(cents: number) {
  return new Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR" }).format(
    cents / 100
  );
}
