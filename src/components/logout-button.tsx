"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // The page stays alive but hidden after logout; reset so the button is not
  // stuck disabled on the next login.
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
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label={isLoggingOut ? "Cerrando sesión" : "Cerrar sesión"}
      className={className}
    >
      <LogOut className="size-6" aria-hidden />
    </button>
  );
}
