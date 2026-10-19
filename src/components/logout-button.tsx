"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // The page stays alive but hidden after logout; reset so the button is not
  // stuck on "Saliendo…" on the next login.
  useLayoutEffect(() => {
    return () => setIsLoggingOut(false);
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "Saliendo…" : "Salir"}
    </Button>
  );
}
