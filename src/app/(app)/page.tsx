import { Suspense } from "react";
import { getCardsWithLatestMovements } from "@/lib/dal";
import { CardMovements, CardMovementsSkeleton } from "./card-movements";
import { HomeHeader } from "./home-header";

const LATEST_MOVEMENTS = 5;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-8 pb-6">
      <HomeHeader />
      <Suspense fallback={<CardMovementsSkeleton rows={LATEST_MOVEMENTS} />}>
        <Cards />
      </Suspense>
    </main>
  );
}

async function Cards() {
  const cards = await getCardsWithLatestMovements(LATEST_MOVEMENTS);
  return <CardMovements cards={cards} />;
}
