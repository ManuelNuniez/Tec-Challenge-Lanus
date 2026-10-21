import { BackButton } from "@/components/back-button";

// Outside the (app) group, so the detail has no bottom bar. The header stays
// while the movement loads, fails or isn't found, so there's always a way back.
export default function MovementLayout({
  children,
}: LayoutProps<"/movements/[id]">) {
  return (
    <main className="flex flex-1 flex-col px-6 pt-8 pb-6">
      <header className="flex items-center gap-2">
        <BackButton fallbackHref="/movements" label="Volver" />
        <h1 className="text-xl font-semibold">Detalle del movimiento</h1>
      </header>
      {children}
    </main>
  );
}
