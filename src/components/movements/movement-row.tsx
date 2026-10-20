import { ArrowDown, ArrowUp, Repeat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";
import type { MovementType } from "@/generated/prisma/enums";
import { formatAmount } from "@/lib/format";

type MovementTypeStyle = {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  isIncome: boolean;
};

// Labels and icon colors per type, as in the Figma components. Subscriptions
// use a repeat icon instead of the Figma's two arrows, which read as a
// transfer rather than a recurring charge.
export const MOVEMENT_TYPES: Record<MovementType, MovementTypeStyle> = {
  SUBSCRIPTION: {
    label: "Pago de suscripción",
    icon: Repeat,
    iconClassName: "bg-movement-subscription-soft text-movement-subscription",
    isIncome: false,
  },
  CASH_IN: {
    label: "Pago recibido",
    icon: ArrowDown,
    iconClassName: "bg-movement-cash-in-soft text-movement-cash-in",
    isIncome: true,
  },
  CASH_OUT: {
    label: "Pago enviado",
    icon: ArrowUp,
    iconClassName: "bg-movement-cash-out-soft text-movement-cash-out",
    isIncome: false,
  },
};

type MovementRowProps = {
  movement: {
    type: MovementType;
    counterparty: string;
    amountCents: number;
  };
};

export function MovementRow({ movement }: MovementRowProps) {
  const { label, icon: Icon, iconClassName, isIncome } =
    MOVEMENT_TYPES[movement.type];

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-xs">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconClassName,
        )}
      >
        <Icon className="size-4" strokeWidth={2.5} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{movement.counterparty}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      {/* Unlike the Figma, the amount says whether money came in or went out:
          the sign carries it and the color backs it up. The minus is the real
          minus sign (U+2212), as wide as the plus. */}
      <p
        className={cn(
          "shrink-0 text-sm font-medium",
          isIncome ? "text-amount-income" : "text-amount-expense",
        )}
      >
        {isIncome ? "+" : "\u2212"}
        {formatAmount(movement.amountCents)}
      </p>
    </div>
  );
}

export function MovementRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-xs">
      <Skeleton className="size-10 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3.5 w-14" />
    </div>
  );
}
