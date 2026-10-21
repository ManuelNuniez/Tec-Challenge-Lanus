import { SearchX } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// Same answer whether the movement doesn't exist or belongs to someone else,
// so the screen gives nothing away.
export default function MovementNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
        <SearchX className="size-7" aria-hidden />
      </span>
      <div>
        <p className="font-medium">No encontramos este movimiento</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede que el link esté incompleto. Buscalo en tus movimientos.
        </p>
      </div>
      <Link
        href="/movements"
        className={buttonVariants({ className: "h-11 rounded-xl px-6" })}
      >
        Ver movimientos
      </Link>
    </div>
  );
}
