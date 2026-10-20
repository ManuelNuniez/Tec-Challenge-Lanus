import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { Prisma } from "@/generated/prisma/client";
import type { MovementType } from "@/generated/prisma/enums";
import type { MovementFilters } from "@/lib/movement-filters";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Single entry point for "who is logged in". Every screen and endpoint that
// needs the user goes through here; the proxy is only a first, optimistic check.
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) {
    redirect("/api/auth/logout");
  }

  return user;
});

// Each card with its latest movements, so the Home can switch between cards
// without asking for more data.
export async function getCardsWithLatestMovements(limit: number) {
  const user = await getCurrentUser();
  return prisma.card.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      issuer: true,
      lastFour: true,
      holderName: true,
      expMonth: true,
      expYear: true,
      balanceCents: true,
      movements: {
        orderBy: { occurredAt: "desc" },
        take: limit,
        select: { id: true, type: true, counterparty: true, amountCents: true },
      },
    },
  });
}

type MovementListItem = {
  id: string;
  type: MovementType;
  counterparty: string;
  amountCents: number;
};

// Every movement of the user, newest first, narrowed by the Movimientos search
// and filter. Written in SQL because Prisma's filters can't ignore accents:
// unaccent() lets "jose" find "José". Values still go in as parameters.
export async function getMovements({ q, type }: MovementFilters) {
  const user = await getCurrentUser();

  const conditions = [Prisma.sql`"userId" = ${user.id}`];
  if (type) {
    conditions.push(Prisma.sql`"type" = ${type}::"MovementType"`);
  }
  if (q) {
    // %, _ and \ are special in LIKE; escape them so they match themselves.
    const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    conditions.push(
      Prisma.sql`unaccent("counterparty") ILIKE unaccent(${pattern})`,
    );
  }

  return prisma.$queryRaw<MovementListItem[]>`
    SELECT "id", "type", "counterparty", "amountCents"
    FROM "movements"
    WHERE ${Prisma.join(conditions, " AND ")}
    ORDER BY "occurredAt" DESC
  `;
}
