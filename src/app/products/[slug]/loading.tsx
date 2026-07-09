import { PageContainer } from "@/components/page-container";

export default function Loading() {
  return (
    <main className="flex-1">
      <PageContainer className="py-16">
        <div className="h-3 w-56 bg-surface animate-pulse mb-10" />
        <div className="grid sm:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3">
            <div className="aspect-square bg-surface animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 w-16 bg-surface animate-pulse" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-3 w-24 bg-surface animate-pulse" />
            <div className="h-9 w-3/4 bg-surface animate-pulse" />
            <div className="h-6 w-28 bg-surface animate-pulse" />
            <div className="h-4 w-full bg-surface animate-pulse" />
            <div className="h-4 w-5/6 bg-surface animate-pulse" />
            <div className="h-4 w-2/3 bg-surface animate-pulse" />
            <div className="h-[52px] w-full bg-surface animate-pulse mt-4" />
            <div className="h-[52px] w-full bg-surface animate-pulse" />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
