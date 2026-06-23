import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import { NewsletterForm } from "@/components/newsletter-form";
import { PageContainer } from "@/components/page-container";

export function Footer() {
  return (
    <footer className="bg-[#111] text-white mt-20">
      <PageContainer className="pt-24 pb-10">
        <div className="grid sm:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div className="flex flex-col gap-3 sm:col-span-1">
            <p className="font-serif text-2xl">岚玉</p>
            <p className="text-[10px] tracking-[0.2em] text-gold">LAN YU</p>
            <p className="text-sm text-[#9D9D9D] leading-relaxed mt-2">
              东方玉石艺术品牌。坚持天然玉石、原创设计、匠心制作。
              <br />
              Natural jadeite, curated from a private collection.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm tracking-widest">品类 COLLECTIONS</p>
            <ul className="flex flex-col gap-3 text-sm text-[#B9B9B9]">
              {PRODUCT_CATEGORIES.filter((c) => c.value !== "OTHER").map((c) => (
                <li key={c.value}>
                  <Link href={`/collections/${c.value}`} className="hover:text-white transition-colors">
                    {c.zh} {c.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm tracking-widest">支持 SUPPORT</p>
            <ul className="flex flex-col gap-3 text-sm text-[#B9B9B9]">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">登录 Log in</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">注册 Sign up</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">订单 Orders</Link>
              </li>
            </ul>
            <div className="flex gap-3 mt-2 text-[#B9B9B9]">
              <span title="即将上线 Coming soon" className="cursor-default">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </span>
              <span title="即将上线 Coming soon" className="cursor-default">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                  <path d="M21 6c-.8.4-1.6.7-2.5.8.9-.5 1.6-1.4 1.9-2.4-.8.5-1.7.8-2.7 1A4 4 0 0 0 11 9c0 .3 0 .6.1.9C7.7 9.7 4.7 8 2.7 5.4c-.4.7-.6 1.4-.6 2.2 0 1.6.8 3 2.1 3.8-.8 0-1.5-.2-2.1-.6 0 1.9 1.4 3.6 3.2 4-.6.1-1.2.2-1.8.1.5 1.6 2 2.7 3.8 2.7C5.9 18.7 3.7 19.4 1.5 19.2c1.9 1.2 4.1 1.9 6.5 1.9 7.8 0 12-6.5 12-12.1V8.5c.8-.6 1.5-1.3 2-2.1Z" />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm tracking-widest">订阅资讯 NEWSLETTER</p>
            <p className="text-sm text-[#9D9D9D]">订阅获取新品与活动信息</p>
            <NewsletterForm />
          </div>
        </div>

        <p className="text-center text-[14px] text-[#7D7D7D] pt-10">
          © {new Date().getFullYear()} 岚玉 LAN YU. ALL RIGHTS RESERVED.
        </p>
      </PageContainer>
    </footer>
  );
}
