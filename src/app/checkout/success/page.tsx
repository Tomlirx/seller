import Link from "next/link";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-16 text-center">
      <ClearCartOnMount />
      <h1 className="text-2xl font-semibold mb-4">Thank you for your order!</h1>
      <p className="text-zinc-600 mb-6">
        Your payment was successful. You can track its status on your orders page.
      </p>
      <Link href="/orders" className="underline">
        View your orders
      </Link>
    </main>
  );
}
