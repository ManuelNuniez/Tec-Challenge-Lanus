import { cn } from "cn";
import type { ReactNode } from "react";
import { IssuerLogo } from "@/components/cards/issuer-logo";
import {
  MOVEMENT_STATUSES,
  MOVEMENT_TYPES,
} from "@/components/movements/movement-row";
import { Skeleton } from "@/components/ui/skeleton";
import type { MovementStatus, OperationType } from "@/generated/prisma/enums";
import type { getMovement } from "@/lib/dal";
import {
  formatAmount,
  formatLongDate,
  formatTaxId,
  formatTime,
} from "@/lib/format";

type MovementDetailData = NonNullable<Awaited<ReturnType<typeof getMovement>>>;

const OPERATION_TYPES: Record<OperationType, string> = {
  TRANSFER: "Transferencia",
  SUBSCRIPTION: "Suscripción",
  CARD_PAYMENT: "Pago con tarjeta física",
};

// A line under the status when the movement didn't simply go through, saying
// what it means for the balance.
function statusNote({
  status,
  isIncome,
}: {
  status: MovementStatus;
  isIncome: boolean;
}) {
  if (status === "PENDING") {
    return "Todavía se está procesando y no impactó en tu saldo.";
  }
  if (status === "REJECTED") {
    return isIncome
      ? "No se sumó nada a tu saldo."
      : "No se descontó nada de tu saldo.";
  }
  return null;
}

export function MovementDetail({ movement }: { movement: MovementDetailData }) {
  const { label, icon: Icon, iconClassName, isIncome } =
    MOVEMENT_TYPES[movement.type];
  const status = MOVEMENT_STATUSES[movement.status];
  const StatusIcon = status.icon;
  const isRejected = movement.status === "REJECTED";
  const note = statusNote({ status: movement.status, isIncome });
  // The card shows only where money left: what it paid with, or where a
  // transfer was sent from. Money in has no card to show.
  const cardLabel = isIncome
    ? null
    : movement.operationType === "TRANSFER"
      ? "Enviado desde"
      : "Pagado con";

  return (
    <>
      <div className="mt-8 flex flex-col items-center text-center">
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl",
            iconClassName,
          )}
        >
          <Icon className="size-6" strokeWidth={2.5} aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-balance break-words">
          {movement.counterparty}
        </h2>
        <p className="text-sm text-muted-foreground">{label}</p>

        {/* Same rules as the lists: sign for the direction, green only for
            money in, grey when it never moved. */}
        <p
          className={cn(
            "mt-4 text-3xl font-semibold",
            isRejected
              ? "text-muted-foreground"
              : isIncome && "text-amount-income",
          )}
        >
          {isIncome ? "+" : "−"}
          {formatAmount(movement.amountCents)}
        </p>

        <p
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
            status.badgeClassName,
          )}
        >
          <StatusIcon className="size-4" aria-hidden />
          {status.label}
        </p>
        {note && <p className="mt-2 text-sm text-muted-foreground">{note}</p>}
      </div>

      <dl className="mt-8 divide-y rounded-2xl bg-card px-4 shadow-xs">
        <DetailRow label="Tipo de operación">
          {OPERATION_TYPES[movement.operationType]}
        </DetailRow>
        <DetailRow label="Fecha">
          <span className="block">{formatLongDate(movement.occurredAt)}</span>
          <span className="block">{formatTime(movement.occurredAt)}</span>
        </DetailRow>
        <DetailRow label="Concepto">
          {movement.description ?? (
            <span className="font-normal text-muted-foreground">
              Sin concepto
            </span>
          )}
        </DetailRow>
        {movement.taxId && (
          <DetailRow label="CUIT/CUIL">{formatTaxId(movement.taxId)}</DetailRow>
        )}
        {cardLabel && (
          <DetailRow label={cardLabel}>
            <span className="inline-flex items-center gap-2">
              <IssuerLogo issuer={movement.card.issuer} />
              <span>
                <span className="sr-only">terminada en </span>
                <span aria-hidden>•••• </span>
                {movement.card.lastFour}
              </span>
            </span>
          </DetailRow>
        )}
        <DetailRow label="N.° de operación">
          <span className="tabular-nums">{movement.operationNumber}</span>
        </DetailRow>
      </dl>
    </>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium break-words">
        {children}
      </dd>
    </div>
  );
}

export function MovementDetailSkeleton() {
  return (
    <div aria-hidden>
      <div className="mt-8 flex flex-col items-center">
        <Skeleton className="size-14 rounded-2xl bg-foreground/8" />
        <Skeleton className="mt-4 h-5 w-36 bg-foreground/8" />
        <Skeleton className="mt-2 h-3.5 w-24 bg-foreground/8" />
        <Skeleton className="mt-5 h-8 w-40 bg-foreground/8" />
        <Skeleton className="mt-3 h-7 w-28 rounded-full bg-foreground/8" />
      </div>
      <div className="mt-8 divide-y rounded-2xl bg-card px-4 shadow-xs">
        {[28, 36, 24, 28, 20].map((width, index) => (
          <div key={index} className="flex justify-between gap-4 py-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5" style={{ width: `${width * 4}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
