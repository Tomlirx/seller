import Link from "next/link";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { PageContainer } from "@/components/page-container";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex-1">
      <ClearCartOnMount />
      <PageContainer className="py-28 max-w-xl text-center">
        <span className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
            <path d="M5 12.5 L10 17.5 L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-xs tracking-[0.3em] text-gold mb-4">ORDER CONFIRMED</p>
        <h1 className="font-serif text-3xl text-ink mb-5">感谢您的订购</h1>
        <p className="text-ink-soft leading-[2] mb-10">
          支付成功，我们会尽快为您安排发货。
          <br />
          Your payment was successful. Track its status on your orders page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/orders"
            data-cta
            className="inline-flex items-center justify-center h-[52px] px-8 bg-gold text-canvas text-sm uppercase tracking-[0.12em] hover:bg-gold-deep transition-colors"
          >
            查看订单 View Orders
          </Link>
          <Link
            href="/collections"
            data-cta
            className="inline-flex items-center justify-center h-[52px] px-8 border border-gold/40 text-gold text-sm uppercase tracking-[0.12em] hover:bg-gold hover:text-canvas transition-colors"
          >
            继续浏览 Continue
          </Link>
        </div>
      </PageContainer>
    </main>
  );
}
