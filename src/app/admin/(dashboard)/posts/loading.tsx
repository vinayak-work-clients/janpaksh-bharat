import { Skeleton } from "@/components/Skeleton";
import { Card } from "@/components/admin/ui/Card";

export default function PostsLoading() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Loading posts">
      <div className="grid gap-3 md:grid-cols-12">
        <Skeleton className="h-11 md:col-span-4" />
        <div className="grid grid-cols-2 gap-3 md:col-span-8 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-11" />)}
        </div>
      </div>
      <Card flush>
        <ul className="divide-y divide-rule">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-12 w-[4.5rem] shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
              <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
              <Skeleton className="hidden h-6 w-24 rounded-full md:block" />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
