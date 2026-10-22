import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  CardIssuer,
  MovementStatus,
  MovementType,
  OperationType,
  PrismaClient,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Login credentials defined in the Figma.
const USER_EMAIL = "soygranate@clublanus.com";
const USER_PASSWORD = "GRANATE1@";

type SeedMovement = {
  type: MovementType;
  operationType: OperationType;
  status: MovementStatus;
  counterparty: string;
  taxId?: string;
  description?: string;
  amountCents: number;
  // Argentina time, as the user would see it on the receipt.
  at: string;
  card: "mastercard" | "visa";
};

// Most recent first. The Mastercard's first four match the Home in the Figma.
// The 1.000.000 one is there on purpose, to check that long amounts and names
// fit. The pending and rejected ones show the other two states; they go on the
// Visa so the Mastercard's Home stays as in the Figma.
const movements: SeedMovement[] = [
  { type: "CASH_OUT", operationType: "TRANSFER", status: "PENDING", counterparty: "Martina Díaz", taxId: "27398745219", description: "Entradas para la platea", amountCents: 45000, at: "2026-10-20 20:15", card: "visa" },
  { type: "SUBSCRIPTION", operationType: "SUBSCRIPTION", status: "COMPLETED", counterparty: "Adobe", description: "Creative Cloud", amountCents: 12500, at: "2026-10-20 06:12", card: "mastercard" },
  { type: "CASH_OUT", operationType: "CARD_PAYMENT", status: "REJECTED", counterparty: "Tienda Granate", description: "Camiseta titular 2026", amountCents: 8999900, at: "2026-10-19 18:34", card: "visa" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Concesionaria Granate S.A.", taxId: "30715489631", description: "Venta del auto", amountCents: 100000000, at: "2026-10-19 15:47", card: "visa" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Ronaldo", taxId: "20301254785", description: "Entradas para el partido", amountCents: 9500, at: "2026-10-19 11:20", card: "mastercard" },
  { type: "SUBSCRIPTION", operationType: "SUBSCRIPTION", status: "COMPLETED", counterparty: "Figma", description: "Plan Professional", amountCents: 12500, at: "2026-10-18 07:03", card: "mastercard" },
  { type: "CASH_OUT", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Juan Pérez", taxId: "20298745632", description: "Cena del sábado", amountCents: 9500, at: "2026-10-17 23:41", card: "mastercard" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "José Suárez", taxId: "20284561237", amountCents: 9500, at: "2026-10-16 14:05", card: "visa" },
  { type: "CASH_OUT", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Juan Rodríguez", taxId: "20247896326", description: "Fútbol 5", amountCents: 4500, at: "2026-10-15 21:58", card: "mastercard" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Julio César", taxId: "20358744126", amountCents: 46384, at: "2026-10-14 10:32", card: "mastercard" },
  { type: "CASH_OUT", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Mariano Martínez", taxId: "20369852141", description: "Regalo de cumpleaños", amountCents: 7250, at: "2026-10-12 19:16", card: "visa" },
  { type: "SUBSCRIPTION", operationType: "SUBSCRIPTION", status: "COMPLETED", counterparty: "Club Atlético Lanús", description: "Cuota social", amountCents: 35000, at: "2026-10-11 08:00", card: "mastercard" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Juan Cabrera", taxId: "20315987424", amountCents: 50000, at: "2026-10-10 17:44", card: "mastercard" },
  { type: "CASH_OUT", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Jorge Álvarez", taxId: "20425631781", description: "Camiseta oficial", amountCents: 18999, at: "2026-10-08 12:27", card: "visa" },
  { type: "SUBSCRIPTION", operationType: "SUBSCRIPTION", status: "COMPLETED", counterparty: "Spotify", description: "Premium Individual", amountCents: 3299, at: "2026-10-07 05:50", card: "visa" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Lucía Fernández", taxId: "27385214761", description: "Devolución", amountCents: 5000, at: "2026-10-05 16:09", card: "mastercard" },
  { type: "SUBSCRIPTION", operationType: "SUBSCRIPTION", status: "COMPLETED", counterparty: "Netflix", description: "Plan Estándar", amountCents: 8999, at: "2026-10-04 04:30", card: "mastercard" },
  { type: "CASH_OUT", operationType: "CARD_PAYMENT", status: "COMPLETED", counterparty: "Kiosco El Granate", amountCents: 3000, at: "2026-10-02 18:52", card: "mastercard" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Diego Romero", taxId: "20332145690", description: "Asado del domingo", amountCents: 50000, at: "2026-09-30 20:38", card: "visa" },
  { type: "SUBSCRIPTION", operationType: "SUBSCRIPTION", status: "COMPLETED", counterparty: "Google One", description: "100 GB", amountCents: 1999, at: "2026-09-28 09:14", card: "visa" },
  { type: "CASH_OUT", operationType: "CARD_PAYMENT", status: "COMPLETED", counterparty: "Complejo La Fortaleza", description: "Alquiler de cancha", amountCents: 12000, at: "2026-09-25 22:10", card: "mastercard" },
  { type: "CASH_IN", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Carlos Benítez", taxId: "20325874105", amountCents: 85000, at: "2026-09-23 13:25", card: "mastercard" },
  { type: "CASH_OUT", operationType: "TRANSFER", status: "COMPLETED", counterparty: "Valentina López", taxId: "27401258960", description: "Viaje a la cancha", amountCents: 2500, at: "2026-09-20 15:03", card: "visa" },
];

// Balance = what came in minus what went out, so it always matches the
// movements. Only completed ones count: a pending one hasn't gone through yet
// and a rejected one never will. Mastercard adds up to the 978.85 of the Figma.
function balanceFor(card: SeedMovement["card"]) {
  return movements
    .filter((movement) => movement.card === card)
    .filter((movement) => movement.status === "COMPLETED")
    .reduce(
      (balance, { type, amountCents }) =>
        type === "CASH_IN" ? balance + amountCents : balance - amountCents,
      0,
    );
}

// "2026-10-20 06:12" in Argentina time (UTC-3, no daylight saving).
function argentinaTime(at: string) {
  return new Date(`${at.replace(" ", "T")}:00-03:00`);
}

async function main() {
  // Start from a clean slate so the seed can be run more than once.
  // TRUNCATE instead of deleteMany so operation numbers start over at
  // 100000001 every time.
  await prisma.$executeRaw`TRUNCATE "movements" RESTART IDENTITY`;
  await prisma.card.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: USER_EMAIL,
      passwordHash: await bcrypt.hash(USER_PASSWORD, 10),
      name: "Granate",
    },
  });

  const mastercard = await prisma.card.create({
    data: {
      userId: user.id,
      issuer: CardIssuer.MASTERCARD,
      lastFour: "1234",
      holderName: "Soy Granate",
      expMonth: 2,
      expYear: 2030,
      balanceCents: balanceFor("mastercard"),
    },
  });

  const visa = await prisma.card.create({
    data: {
      userId: user.id,
      issuer: CardIssuer.VISA,
      lastFour: "5678",
      holderName: "Soy Granate",
      expMonth: 9,
      expYear: 2028,
      balanceCents: balanceFor("visa"),
    },
  });

  const cardIds = { mastercard: mastercard.id, visa: visa.id };

  // Oldest first, so the operation number grows with the date.
  await prisma.movement.createMany({
    data: movements.toReversed().map(({ card, at, ...movement }) => ({
      ...movement,
      userId: user.id,
      cardId: cardIds[card],
      occurredAt: argentinaTime(at),
    })),
  });

  console.log(
    `Seed listo: 1 usuario, 2 tarjetas, ${movements.length} movimientos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
