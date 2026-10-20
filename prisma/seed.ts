import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  CardIssuer,
  MovementType,
  PrismaClient,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Login credentials defined in the Figma.
const USER_EMAIL = "soygranate@clublanus.com";
const USER_PASSWORD = "GRANATE1@";

type SeedMovement = {
  type: MovementType;
  counterparty: string;
  description?: string;
  amountCents: number;
  daysAgo: number;
  card: "mastercard" | "visa";
};

// Most recent first. The first four match the Home in the Figma. The
// 1.000.000 one is there on purpose, to check that long amounts and names fit.
const movements: SeedMovement[] = [
  { type: "SUBSCRIPTION", counterparty: "Adobe", description: "Creative Cloud", amountCents: 12500, daysAgo: 0, card: "mastercard" },
  { type: "CASH_IN", counterparty: "Concesionaria Granate S.A.", description: "Venta del auto", amountCents: 100000000, daysAgo: 1, card: "visa" },
  { type: "CASH_IN", counterparty: "Ronaldo", description: "Entradas para el partido", amountCents: 9500, daysAgo: 1, card: "mastercard" },
  { type: "SUBSCRIPTION", counterparty: "Figma", description: "Plan Professional", amountCents: 12500, daysAgo: 2, card: "mastercard" },
  { type: "CASH_OUT", counterparty: "Juan Pérez", description: "Cena del sábado", amountCents: 9500, daysAgo: 3, card: "mastercard" },
  { type: "CASH_IN", counterparty: "José Suárez", amountCents: 9500, daysAgo: 4, card: "visa" },
  { type: "CASH_OUT", counterparty: "Juan Rodríguez", description: "Fútbol 5", amountCents: 4500, daysAgo: 5, card: "mastercard" },
  { type: "CASH_IN", counterparty: "Julio César", amountCents: 46384, daysAgo: 6, card: "mastercard" },
  { type: "CASH_OUT", counterparty: "Mariano Martínez", description: "Regalo de cumpleaños", amountCents: 7250, daysAgo: 8, card: "visa" },
  { type: "SUBSCRIPTION", counterparty: "Club Atlético Lanús", description: "Cuota social", amountCents: 35000, daysAgo: 9, card: "mastercard" },
  { type: "CASH_IN", counterparty: "Juan Cabrera", amountCents: 50000, daysAgo: 10, card: "mastercard" },
  { type: "CASH_OUT", counterparty: "Jorge Álvarez", description: "Camiseta oficial", amountCents: 18999, daysAgo: 12, card: "visa" },
  { type: "SUBSCRIPTION", counterparty: "Spotify", description: "Premium Individual", amountCents: 3299, daysAgo: 13, card: "visa" },
  { type: "CASH_IN", counterparty: "Lucía Fernández", description: "Devolución", amountCents: 5000, daysAgo: 15, card: "mastercard" },
  { type: "SUBSCRIPTION", counterparty: "Netflix", description: "Plan Estándar", amountCents: 8999, daysAgo: 16, card: "mastercard" },
  { type: "CASH_OUT", counterparty: "Sofía Gómez", amountCents: 3000, daysAgo: 18, card: "mastercard" },
  { type: "CASH_IN", counterparty: "Diego Romero", description: "Asado del domingo", amountCents: 50000, daysAgo: 20, card: "visa" },
  { type: "SUBSCRIPTION", counterparty: "Google One", description: "100 GB", amountCents: 1999, daysAgo: 22, card: "visa" },
  { type: "CASH_OUT", counterparty: "María González", description: "Alquiler de cancha", amountCents: 12000, daysAgo: 25, card: "mastercard" },
  { type: "CASH_IN", counterparty: "Carlos Benítez", amountCents: 85000, daysAgo: 27, card: "mastercard" },
  { type: "CASH_OUT", counterparty: "Valentina López", description: "Viaje a la cancha", amountCents: 2500, daysAgo: 30, card: "visa" },
];

// Balance = what came in minus what went out, so it always matches the
// movements. Mastercard adds up to the 978.85 shown in the Figma.
function balanceFor(card: SeedMovement["card"]) {
  return movements
    .filter((movement) => movement.card === card)
    .reduce(
      (balance, { type, amountCents }) =>
        type === "CASH_IN" ? balance + amountCents : balance - amountCents,
      0,
    );
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  // Start from a clean slate so the seed can be run more than once.
  await prisma.movement.deleteMany();
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

  await prisma.movement.createMany({
    data: movements.map(({ card, daysAgo: days, ...movement }) => ({
      ...movement,
      userId: user.id,
      cardId: cardIds[card],
      occurredAt: daysAgo(days),
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
