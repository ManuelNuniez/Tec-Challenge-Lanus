import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
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
