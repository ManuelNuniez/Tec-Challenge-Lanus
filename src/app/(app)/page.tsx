import Link from "next/link";
import { Suspense } from "react";
import { CardCarousel, CardCarouselSkeleton } from "@/components/cards/card-carousel";
import { MovementRow, MovementRowSkeleton } from "@/components/movements/movement-row";
import { getCards, getLatestMovements } from "@/lib/dal";
import { HomeHeader } from "./home-header";

const LATEST_MOVEMENTS = 5;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-8 pb-6">
      <HomeHeader />

      <div className="mt-6">
        <Suspense fallback={<CardCarouselSkeleton />}>
          <Cards />
        </Suspense>
      </div>

      <section aria-labelledby="latest-movements" className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 id="latest-movements" className="text-base font-medium">
            Últimos movimientos
          </h2>
          <Link
            href="/movements"
            className="rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Ver todos
          </Link>
        </div>
        <Suspense fallback={<LatestMovementsSkeleton />}>
          <LatestMovements />
        </Suspense>
      </section>
    </main>
  );
}

async function Cards() {
  const cards = await getCards();
  return <CardCarousel cards={cards} />;
}

async function LatestMovements() {
  const movements = await getLatestMovements(LATEST_MOVEMENTS);

  if (movements.length === 0) {
    return (
      <div className="mt-4 rounded-2xl bg-card px-6 py-8 text-center shadow-xs">
        <p className="font-medium">Todavía no tenés movimientos</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuando hagas o recibas un pago, lo vas a ver acá.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {movements.map((movement) => (
        <li key={movement.id}>
          <MovementRow movement={movement} />
        </li>
      ))}
    </ul>
  );
}

function LatestMovementsSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3" aria-hidden>
      {Array.from({ length: LATEST_MOVEMENTS }, (_, index) => (
        <MovementRowSkeleton key={index} />
      ))}
    </div>
  );
}
