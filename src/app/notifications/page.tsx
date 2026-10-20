import { ArrowLeft, Bell } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notificaciones | GranaBank",
};

// Always empty for now: notifications would come from an async process that
// is out of scope. Outside the (app) group, so it has no bottom bar.
export default function NotificationsPage() {
  return (
    <main className="flex flex-1 flex-col px-6 pt-8 pb-6">
      <header className="flex items-center gap-2">
        {/* Back to Home rather than history.back(), so it also works when the
            page is opened directly. Home is the only way in. */}
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="-ml-2 flex size-10 items-center justify-center rounded-full outline-none transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <h1 className="text-xl font-semibold">Notificaciones</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
          <Bell className="size-7" aria-hidden />
        </span>
        <p className="text-muted-foreground">No tenés notificaciones nuevas</p>
      </div>
    </main>
  );
}
