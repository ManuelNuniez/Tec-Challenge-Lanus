import type { CardIssuer } from "@/generated/prisma/enums";

export const ISSUER_NAMES: Record<CardIssuer, string> = {
  MASTERCARD: "Mastercard",
  VISA: "Visa",
};

// Simplified issuer marks, drawn here so the app ships no third-party images.
export function IssuerLogo({ issuer }: { issuer: CardIssuer }) {
  if (issuer === "MASTERCARD") {
    return (
      <svg
        width="32"
        height="20"
        viewBox="0 0 32 20"
        role="img"
        aria-label={ISSUER_NAMES.MASTERCARD}
      >
        <circle cx="10" cy="10" r="10" fill="#eb001b" />
        <circle cx="22" cy="10" r="10" fill="#f79e1b" />
        <path d="M16 2a10 10 0 0 1 0 16 10 10 0 0 1 0-16Z" fill="#ff5f00" />
      </svg>
    );
  }

  return (
    <svg
      width="40"
      height="20"
      viewBox="0 0 40 20"
      role="img"
      aria-label={ISSUER_NAMES.VISA}
    >
      <rect width="40" height="20" rx="3" fill="#1a1f71" />
      <text
        x="20"
        y="14.5"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="11"
        fontStyle="italic"
        fontWeight="800"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    </svg>
  );
}
