import { Suspense } from "react";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/dal";

// Temporary home to check that login lands here. Replaced in feat/home.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
        <Greeting />
      </Suspense>
    </main>
  );
}

async function Greeting() {
  const user = await getCurrentUser();
  return (
    <>
      <h1 className="text-2xl font-semibold text-primary">Hola {user.name}</h1>
      <LogoutButton />
    </>
  );
}
