import { PageContainer } from "@/components/page-container";
import { CategoryGrid } from "@/components/category-grid";
import { Divider } from "@/components/divider";

export const dynamic = "force-dynamic";

export default function CollectionsPage() {
  return (
    <main className="flex-1">
      <PageContainer className="py-16">
        <div className="text-center mb-10">
          <p className="font-serif text-2xl text-ink">全部品类</p>
          <p className="text-xs tracking-widest text-ink-soft mt-2">ALL COLLECTIONS</p>
          <Divider className="mt-6" />
        </div>
        <CategoryGrid />
      </PageContainer>
    </main>
  );
}
