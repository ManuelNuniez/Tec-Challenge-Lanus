import { cn } from "cn";
import { useId } from "react";
import type { CardIssuer } from "@/generated/prisma/enums";
import { formatAmount, formatExpiry } from "@/lib/format";
import { IssuerLogo } from "./issuer-logo";

export type BankCardData = {
  id: string;
  issuer: CardIssuer;
  lastFour: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  balanceCents: number;
};

// Mastercard is the granate card of the Figma; Visa takes the pink one that
// peeks out next to it.
const CARD_STYLES: Record<CardIssuer, string> = {
  MASTERCARD: "bg-primary text-primary-foreground",
  VISA: "bg-[#f7c3c6] text-primary",
};

export function BankCard({ card }: { card: BankCardData }) {
  return (
    <div
      className={cn(
        "flex aspect-[1.75] flex-col justify-between rounded-3xl p-5 shadow-md",
        CARD_STYLES[card.issuer],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs opacity-80">Balance</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <CardChip />
            <p className="text-2xl font-semibold">
              {formatAmount(card.balanceCents)}
            </p>
          </div>
        </div>
        <IssuerLogo issuer={card.issuer} />
      </div>

      <p className="text-lg tracking-widest">
        <span className="sr-only">Tarjeta terminada en </span>
        <span aria-hidden>**** **** **** </span>
        {card.lastFour}
      </p>

      <div className="flex items-end justify-between">
        <p className="text-sm font-medium">{card.holderName}</p>
        <div className="text-right">
          <p className="text-[0.625rem] opacity-80">Exp. Date</p>
          <p className="text-sm font-medium">
            {formatExpiry(card.expMonth, card.expYear)}
          </p>
        </div>
      </div>
    </div>
  );
}

function CardChip() {
  // Each card draws its own chip, so the gradient id must be unique per card.
  const gradientId = useId();

  return (
    <svg width="30" height="22" viewBox="0 0 30 22" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7d774" />
          <stop offset="1" stopColor="#d9a53b" />
        </linearGradient>
      </defs>
      <rect width="30" height="22" rx="4" fill={`url(#${gradientId})`} />
      <path
        d="M0 8h9M0 14h9M21 8h9M21 14h9M9 0v22M21 0v22"
        stroke="#b88a2c"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
