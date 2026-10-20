"use client";

import { CloudOff } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Covers every screen with the bottom bar (Home, Movimientos). The bar stays,
// so the user can still move around or log out.
export default function AppError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  // The details are for the log; the user only sees what to do next.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
        <CloudOff className="size-7" aria-hidden />
      </span>
      <div role="alert">
        <p className="font-medium">No pudimos cargar tus datos</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisá tu conexión y probá de nuevo en un momento.
        </p>
      </div>
      <Button onClick={() => retry()} className="h-11 rounded-xl px-6">
        Reintentar
      </Button>
    </main>
  );
}
