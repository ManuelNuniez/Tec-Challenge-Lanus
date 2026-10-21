"use client";

import { CloudOff } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type LoadErrorProps = {
  error: unknown;
  retry: () => void;
};

// What every screen shows when its data doesn't arrive. Each error.tsx places
// it inside its own frame.
export function LoadError({ error, retry }: LoadErrorProps) {
  // The details are for the log; the user only sees what to do next.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
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
    </div>
  );
}
