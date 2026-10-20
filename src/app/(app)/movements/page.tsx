import type { Metadata } from "next";
import { Suspense } from "react";
import { MovementRowSkeleton } from "@/components/movements/movement-row";
import { Skeleton } from "@/components/ui/skeleton";
import { getMovements } from "@/lib/dal";
import { parseMovementFilters } from "@/lib/movement-filters";
import { MovementsBrowser } from "./movements-browser";

export const metadata: Metadata = {
  title: "Movimientos | GranaBank",
};

export default function MovementsPage({
  searchParams,
}: PageProps<"/movements">) {
  return (
    <main className="flex flex-1 flex-col px-6 pt-8 pb-6">
      <h1 className="text-xl font-semibold">Movimientos</h1>
      <Suspense fallback={<MovementsSkeleton />}>
        <Movements searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Movements({
  searchParams,
}: Pick<PageProps<"/movements">, "searchParams">) {
  const filters = parseMovementFilters(await searchParams);
  const movements = await getMovements(filters);
  return <MovementsBrowser filters={filters} movements={movements} />;
}

function MovementsSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="mt-6 h-11 rounded-xl bg-card shadow-xs" />
      <div className="mt-4 flex gap-2 py-1">
        {[16, 24, 22, 20].map((width) => (
          <Skeleton
            key={width}
            className="h-9 shrink-0 rounded-xl bg-foreground/8"
            style={{ width: `${width * 4}px` }}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, index) => (
          <MovementRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
