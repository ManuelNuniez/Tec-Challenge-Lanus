"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

// The Navigation API is in every current browser but not yet in TypeScript's
// DOM types.
type WindowWithNavigation = Window & { navigation?: { canGoBack: boolean } };

type BackButtonProps = {
  fallbackHref: string;
  label: string;
};

// Goes back to the previous screen, so a list comes back with its search,
// filter and scroll. When there's no screen of ours to go back to (the page
// was opened from a link), it goes to fallbackHref instead.
export function BackButton({ fallbackHref, label }: BackButtonProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Ctrl/Cmd/Shift-click keeps the browser's own behaviour for links.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    if ((window as WindowWithNavigation).navigation?.canGoBack) {
      event.preventDefault();
      router.back();
    }
  }

  return (
    <Link
      href={fallbackHref}
      onClick={handleClick}
      aria-label={label}
      className="-ml-2 flex size-10 items-center justify-center rounded-full outline-none transition-colors hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ArrowLeft className="size-5" aria-hidden />
    </Link>
  );
}
