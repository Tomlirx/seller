import Link from "next/link";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-16 text-center">
      <ClearCartOnMount />
      <h1 className="font-serif text-2xl text-ink mb-4">感谢您的订购 · Thank you for your order!</h1>
      <p className="text-ink-soft mb-6">
        Your payment was successful. You can track its status on your orders page.
      </p>
      <Link href="/orders" className="text-gold underline">
        查看订单 View your orders
      </Link>
    </main>
  );
}
