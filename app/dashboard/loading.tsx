import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-slate-900" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-12 rounded-full bg-slate-900" />
      </div>
    </div>
  );
}
