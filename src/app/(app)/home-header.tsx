import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/dal";

const iconLinkClassName =
  "flex size-10 items-center justify-center rounded-full text-foreground outline-none transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50";

export function HomeHeader() {
  return (
    <header className="flex items-center justify-between">
      <Suspense fallback={<GreetingSkeleton />}>
        <Greeting />
      </Suspense>
      <div className="-mr-2 flex items-center">
        {/* #search puts the cursor in the search box on arrival. */}
        <Link
          href="/movements#search"
          aria-label="Buscar movimientos"
          className={iconLinkClassName}
        >
          <Search className="size-5" aria-hidden />
        </Link>
        <Link
          href="/notifications"
          aria-label="Notificaciones"
          className={iconLinkClassName}
        >
          <Bell className="size-5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}

async function Greeting() {
  const user = await getCurrentUser();
  return (
    <h1>
      <span className="block text-sm text-muted-foreground">Hola</span>
      <span className="block text-xl font-semibold">{user.name}</span>
    </h1>
  );
}

function GreetingSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-0.5" aria-hidden>
      <Skeleton className="h-3.5 w-10 bg-foreground/8" />
      <Skeleton className="h-5 w-24 bg-foreground/8" />
    </div>
  );
}
