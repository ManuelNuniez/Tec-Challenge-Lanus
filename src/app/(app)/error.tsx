"use client";

import { LoadError } from "@/components/load-error";

// Covers every screen with the bottom bar (Home, Movimientos). The bar stays,
// so the user can still move around or log out.
export default function AppError(props: { error: unknown; retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col px-6">
      <LoadError {...props} />
    </main>
  );
}
