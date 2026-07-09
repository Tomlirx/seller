import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { Divider } from "@/components/divider";

export default function NotFound() {
  return (
    <main className="flex-1">
      <PageContainer className="py-32 max-w-xl text-center">
        <p className="text-xs tracking-[0.3em] text-gold mb-4">PAGE NOT FOUND</p>
        <h1 className="font-serif text-6xl text-ink mb-5">404</h1>
        <Divider className="mb-8" />
        <p className="text-ink-soft leading-[2] mb-10">
          您访问的页面不存在或已被移除。
          <br />
          The page you are looking for doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            data-cta
            className="inline-flex items-center justify-center h-[52px] px-8 bg-gold text-canvas text-sm uppercase tracking-[0.12em] hover:bg-gold-deep transition-colors"
          >
            返回首页 Home
          </Link>
          <Link
            href="/collections"
            data-cta
            className="inline-flex items-center justify-center h-[52px] px-8 border border-gold/40 text-gold text-sm uppercase tracking-[0.12em] hover:bg-gold hover:text-canvas transition-colors"
          >
            浏览品类 Collections
          </Link>
        </div>
      </PageContainer>
    </main>
  );
}
