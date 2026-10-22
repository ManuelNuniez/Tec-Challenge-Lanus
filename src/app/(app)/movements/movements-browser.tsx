"use client";

import { Search, X } from "lucide-react";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { MovementRow } from "@/components/movements/movement-row";
import type { MovementRowData } from "@/components/movements/movement-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MovementType } from "@/generated/prisma/enums";
import { SEARCH_MAX_LENGTH } from "@/lib/movement-filters";
import type { MovementFilters } from "@/lib/movement-filters";

// Quick filters from the Figma. "Débito Aut." are the subscriptions.
const TYPE_FILTERS: { type?: MovementType; label: string }[] = [
  { label: "Todos" },
  { type: "SUBSCRIPTION", label: "Débito Aut." },
  { type: "CASH_IN", label: "Recibido" },
  { type: "CASH_OUT", label: "Enviado" },
];

// Wait for a short pause in typing before searching, instead of on every key.
const SEARCH_DELAY_MS = 300;

type MovementsBrowserProps = {
  filters: MovementFilters;
  movements: MovementRowData[];
};

// Search and filter live in the URL and the server answers with the list.
// While the new list is on its way, the current one stays and fades.
export function MovementsBrowser({ filters, movements }: MovementsBrowserProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.q);
  const [type, setType] = useState(filters.type);
  // What the last search asked for. The server answers with these same
  // filters; different ones mean the page was opened from a link while Next
  // kept it alive and hidden, so the box and the chips take the URL's values.
  const [requested, setRequested] = useState(filters);
  const [shownFilters, setShownFilters] = useState(filters);
  if (filters !== shownFilters) {
    setShownFilters(filters);
    const fromLink = filters.q !== requested.q || filters.type !== requested.type;
    if (fromLink && !isPending) {
      setRequested(filters);
      setQuery(filters.q);
      setType(filters.type);
    }
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The Home's search icon links here with #search: go straight to typing.
  useEffect(() => {
    if (window.location.hash === "#search") {
      inputRef.current?.focus();
    }
  }, []);

  // Drop a search still waiting if the page is left or hidden.
  useEffect(() => {
    const timer = searchTimer;
    return () => clearTimeout(timer.current);
  }, []);

  function showResults(nextQuery: string, nextType: MovementType | undefined) {
    clearTimeout(searchTimer.current);
    const params = new URLSearchParams();
    const q = nextQuery.trim();
    setRequested({ q, type: nextType });
    if (q) params.set("q", q);
    if (nextType) params.set("type", nextType);
    const search = params.toString();

    startTransition(() => {
      router.replace(search ? `/movements?${search}` : "/movements", {
        scroll: false,
      });
    });
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(
      () => showResults(nextQuery, type),
      SEARCH_DELAY_MS,
    );
  }

  function handleTypeChange(nextType: MovementType | undefined) {
    setType(nextType);
    showResults(query, nextType);
  }

  // Enter searches right away and closes the keyboard on phones.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showResults(query, type);
    inputRef.current?.blur();
  }

  function clearQuery() {
    setQuery("");
    showResults("", type);
    inputRef.current?.focus();
  }

  function clearFilters() {
    setQuery("");
    setType(undefined);
    showResults("", undefined);
  }

  const hasFilters = Boolean(filters.q || filters.type);

  return (
    <>
      <form role="search" onSubmit={handleSubmit} className="relative mt-6">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          ref={inputRef}
          type="text"
          enterKeyHint="search"
          autoComplete="off"
          aria-label="Buscar movimientos"
          placeholder="Ingresá un nombre o servicio"
          maxLength={SEARCH_MAX_LENGTH}
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          className="h-11 rounded-xl border-transparent bg-card pr-11 pl-10 shadow-xs"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Borrar búsqueda"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </form>

      {/* Scrolls sideways on narrow screens, as the Figma's last chip shows. */}
      <div
        role="group"
        aria-label="Filtrar por tipo"
        className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 py-1 [scrollbar-width:none]"
      >
        {TYPE_FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            aria-pressed={type === filter.type}
            onClick={() => handleTypeChange(filter.type)}
            className="shrink-0 rounded-xl bg-card px-4 py-2 text-sm font-medium shadow-xs outline-none transition-colors hover:bg-primary/8 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {movements.length === 1
          ? "1 movimiento"
          : `${movements.length} movimientos`}
      </p>

      <div
        aria-busy={isPending}
        className={cn(
          "mt-5 transition-opacity motion-reduce:transition-none",
          isPending && "opacity-60",
        )}
      >
        {movements.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {movements.map((movement) => (
              <li key={movement.id}>
                <MovementRow movement={movement} />
              </li>
            ))}
          </ul>
        ) : hasFilters ? (
          <div className="rounded-2xl bg-card px-6 py-8 text-center shadow-xs">
            <p className="font-medium">No encontramos movimientos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Probá con otro nombre o cambiá el filtro.
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4 h-10 rounded-xl px-4"
            >
              Borrar filtros
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl bg-card px-6 py-8 text-center shadow-xs">
            <p className="font-medium">Todavía no tenés movimientos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando hagas o recibas un pago, lo vas a ver acá.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
