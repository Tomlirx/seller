import { PageContainer } from "@/components/page-container";

export default function Loading() {
  return (
    <main className="flex-1">
      <PageContainer className="py-16">
        <div className="h-3 w-48 bg-surface animate-pulse mb-10" />
        <div className="text-center mb-10">
          <div className="h-8 w-28 bg-surface animate-pulse mx-auto mb-3" />
          <div className="h-3 w-20 bg-surface animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-10">
          <div className="hidden sm:flex flex-col gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 w-36 bg-surface animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-square bg-surface animate-pulse" />
                <div className="h-4 w-3/4 bg-surface animate-pulse" />
                <div className="h-3 w-1/3 bg-surface animate-pulse" />
                <div className="h-4 w-1/4 bg-surface animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
