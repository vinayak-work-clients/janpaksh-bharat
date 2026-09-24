import { Skeleton, SkeletonCard, SkeletonRow } from "@/components/Skeleton";

export default function BlogsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading stories">
      <section className="hairline-b bg-paper-2">
        <div className="container-editorial py-14 sm:py-20 lg:py-24">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-4 h-12 w-80 max-w-full" />
          <Skeleton className="mt-6 h-5 w-full max-w-2xl" />
          <Skeleton className="mt-8 h-9 w-96 max-w-full rounded-full" />
        </div>
      </section>
      <section className="container-editorial py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7"><SkeletonCard /></div>
          <div className="flex flex-col gap-8 lg:col-span-5"><SkeletonCard /><SkeletonCard /></div>
        </div>
        <div className="mt-16 grid gap-x-12 md:mt-24 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </section>
    </div>
  );
}
