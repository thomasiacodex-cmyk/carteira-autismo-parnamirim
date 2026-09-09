import { Skeleton } from "@/components/ui/skeleton";

export default function CarteiraLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Skeleton className="mb-4 h-8 w-48" />
      <Skeleton className="h-[500px] w-full rounded-2xl" />
      <div className="mt-6 flex gap-3 justify-center">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
