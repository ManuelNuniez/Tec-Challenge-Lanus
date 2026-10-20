import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";
import type { MovementType } from "@/generated/prisma/enums";
import { formatAmount } from "@/lib/format";

type MovementTypeStyle = {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  amountClassName: string;
};

// Labels, icons and colors per type, as in the Figma components.
export const MOVEMENT_TYPES: Record<MovementType, MovementTypeStyle> = {
  SUBSCRIPTION: {
    label: "Pago de suscripción",
    icon: ArrowDownUp,
    iconClassName: "bg-movement-subscription-soft text-movement-subscription",
    amountClassName: "text-movement-subscription",
  },
  CASH_IN: {
    label: "Pago recibido",
    icon: ArrowDown,
    iconClassName: "bg-movement-cash-in-soft text-movement-cash-in",
    amountClassName: "text-movement-cash-in",
  },
  CASH_OUT: {
    label: "Pago enviado",
    icon: ArrowUp,
    iconClassName: "bg-movement-cash-out-soft text-movement-cash-out",
    amountClassName: "text-movement-cash-out",
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
  const { label, icon: Icon, iconClassName, amountClassName } =
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
      <p className={cn("shrink-0 text-sm font-medium", amountClassName)}>
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
