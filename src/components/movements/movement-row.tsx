import {
  ArrowDown,
  ArrowUp,
  CircleCheck,
  CircleX,
  Hourglass,
  Repeat,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { MovementStatus, MovementType } from "@/generated/prisma/enums";
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

type MovementStatusStyle = {
  label: string;
  icon: LucideIcon;
  // Replaces the type icon when the movement didn't go through; null keeps it.
  tileIcon: LucideIcon | null;
  textClassName: string;
  badgeClassName: string;
};

export const MOVEMENT_STATUSES: Record<MovementStatus, MovementStatusStyle> = {
  COMPLETED: {
    label: "Completado",
    icon: CircleCheck,
    tileIcon: null,
    textClassName: "text-status-completed",
    badgeClassName: "bg-status-completed-soft text-status-completed",
  },
  PENDING: {
    label: "Pendiente",
    icon: Hourglass,
    tileIcon: Hourglass,
    textClassName: "text-status-pending",
    badgeClassName: "bg-status-pending-soft text-status-pending",
  },
  REJECTED: {
    label: "Rechazado",
    icon: CircleX,
    tileIcon: X,
    textClassName: "text-status-rejected",
    badgeClassName: "bg-status-rejected-soft text-status-rejected",
  },
};

// The icon on the left of a movement. A pending or rejected movement shows
// its status, in the status colors: an arrow would say the money moved.
export function movementIcon({
  type,
  status,
}: {
  type: MovementType;
  status: MovementStatus;
}) {
  const { tileIcon, badgeClassName } = MOVEMENT_STATUSES[status];
  return tileIcon
    ? { icon: tileIcon, className: badgeClassName }
    : {
        icon: MOVEMENT_TYPES[type].icon,
        className: MOVEMENT_TYPES[type].iconClassName,
      };
}

export type MovementRowData = {
  id: string;
  type: MovementType;
  status: MovementStatus;
  counterparty: string;
  amountCents: number;
};

// The whole row opens the movement's detail.
export function MovementRow({ movement }: { movement: MovementRowData }) {
  const { label, isIncome } = MOVEMENT_TYPES[movement.type];
  const { icon: Icon, className: iconClassName } = movementIcon(movement);
  const isCompleted = movement.status === "COMPLETED";
  const isRejected = movement.status === "REJECTED";
  const status = MOVEMENT_STATUSES[movement.status];

  return (
    <Link
      href={`/movements/${movement.id}`}
      className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-xs outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
    >
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
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
      <div className="shrink-0 text-right">
        {/* Unlike the Figma, the amount says whether money came in or went
            out. The sign carries it; only money in gets a color, so the list
            stays calm and red is kept for errors. The minus is the real minus
            sign (U+2212), as wide as the plus. A rejected amount goes grey:
            that money never moved. Not struck through, which would hide the
            minus. */}
        <p
          className={cn(
            "text-sm font-medium",
            isRejected
              ? "text-muted-foreground"
              : isIncome
                ? "text-amount-income"
                : "text-foreground",
          )}
        >
          {isIncome ? "+" : "\u2212"}
          {formatAmount(movement.amountCents)}
        </p>
        {/* Completed rows stay as in the Figma; only the other two say so. */}
        {!isCompleted && (
          <p className={cn("text-xs font-medium", status.textClassName)}>
            {status.label}
          </p>
        )}
      </div>
    </Link>
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
