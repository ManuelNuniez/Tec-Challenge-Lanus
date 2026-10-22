import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMovement } from "@/lib/dal";
import { MovementDetail, MovementDetailSkeleton } from "./movement-detail";

export const metadata: Metadata = {
  title: "Detalle del movimiento | GranaBank",
};

export default function MovementPage({
  params,
}: PageProps<"/movements/[id]">) {
  return (
    <Suspense fallback={<MovementDetailSkeleton />}>
      <Movement params={params} />
    </Suspense>
  );
}

async function Movement({
  params,
}: Pick<PageProps<"/movements/[id]">, "params">) {
  const { id } = await params;
  const movement = await getMovement(id);
  if (!movement) {
    notFound();
  }
  return <MovementDetail movement={movement} />;
}
