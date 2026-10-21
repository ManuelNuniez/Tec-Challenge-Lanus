"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import type { BankCardData } from "@/components/cards/bank-card";
import {
  CardCarousel,
  CardCarouselSkeleton,
  cardName,
} from "@/components/cards/card-carousel";
import {
  MovementRow,
  MovementRowSkeleton,
} from "@/components/movements/movement-row";
import type { MovementRowData } from "@/components/movements/movement-row";

export type CardWithMovements = BankCardData & {
  movements: MovementRowData[];
};

// The latest movements follow the card in view. Every card arrives with its
// movements, so switching cards needs no new request.
export function CardMovements({ cards }: { cards: CardWithMovements[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCard = cards[selectedIndex];
  const movements = selectedCard?.movements ?? [];

  // Next keeps the Home alive but hidden, and the carousel starts over on the
  // first card when it comes back. Reset so the list matches it.
  useLayoutEffect(() => {
    return () => setSelectedIndex(0);
  }, []);

  return (
    <>
      <div className="mt-6">
        <CardCarousel cards={cards} onSelectedChange={setSelectedIndex} />
      </div>

      <section aria-labelledby="latest-movements" className="mt-6">
        <LatestMovementsHeader />
        <p className="sr-only" aria-live="polite">
          {selectedCard && `Movimientos de ${cardName(selectedCard)}`}
        </p>

        {movements.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-card px-6 py-8 text-center shadow-xs">
            <p className="font-medium">
              Todavía no tenés movimientos con esta tarjeta
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando hagas o recibas un pago, lo vas a ver acá.
            </p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {movements.map((movement) => (
              <li key={movement.id}>
                <MovementRow movement={movement} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function LatestMovementsHeader() {
  return (
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
  );
}

export function CardMovementsSkeleton({ rows }: { rows: number }) {
  return (
    <>
      <div className="mt-6">
        <CardCarouselSkeleton />
      </div>
      <section aria-labelledby="latest-movements" className="mt-6">
        <LatestMovementsHeader />
        <div className="mt-4 flex flex-col gap-3" aria-hidden>
          {Array.from({ length: rows }, (_, index) => (
            <MovementRowSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
}
