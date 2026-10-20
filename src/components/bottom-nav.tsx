"use client";

import { House, ReceiptText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: House },
  { href: "/movements", label: "Movimientos", icon: ReceiptText },
];

const itemClassName =
  "flex size-12 items-center justify-center rounded-xl text-foreground/70 outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-[current=page]:text-primary";

// A movement's detail still counts as being in Movimientos.
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Icons only, as in the Figma; the labels are there for screen readers.
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="sticky bottom-0 mt-auto rounded-t-3xl bg-card shadow-[0_-4px_16px_rgb(0_0_0/0.05)]"
    >
      <ul className="flex items-center justify-around px-6 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={label}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={itemClassName}
            >
              <Icon className="size-6" aria-hidden />
            </Link>
          </li>
        ))}
        <li>
          <LogoutButton className={itemClassName} />
        </li>
      </ul>
    </nav>
  );
}
