"use client";

import { LoadError } from "@/components/load-error";

// The layout's header stays above it, with the way back.
export default function MovementError(props: {
  error: unknown;
  retry: () => void;
}) {
  return <LoadError {...props} />;
}
