"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { BankCard } from "./bank-card";
import type { BankCardData } from "./bank-card";
import { ISSUER_NAMES } from "./issuer-logo";

type CardCarouselProps = {
  cards: BankCardData[];
  onSelectedChange?: (index: number) => void;
};

// Bleeds to the screen edges so the next card peeks out, as in the Figma.
// Without containScroll every card stops where the first one sits, instead of
// the last one sticking to the right edge. The carousel takes keyboard focus
// so the arrow keys can move it.
export function CardCarousel({ cards, onSelectedChange }: CardCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  // Next keeps the Home alive but hidden, and the carousel is built again when
  // it comes back (from a movement's detail, say). It starts on the card that
  // was in view, so the latest movements below still match it.
  const selectedIndexRef = useRef(0);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      selectedIndexRef.current = api.selectedScrollSnap();
      onSelectedChange?.(selectedIndexRef.current);
    };
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onSelectedChange]);

  useLayoutEffect(() => {
    const selectedIndex = selectedIndexRef;
    return () => setStartIndex(selectedIndex.current);
  }, []);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", containScroll: false, startIndex }}
      tabIndex={0}
      aria-label="Tus tarjetas"
      className="-mx-6 rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <CarouselContent className="ml-2 py-2">
        {cards.map((card) => (
          <CarouselItem
            key={card.id}
            aria-label={cardName(card)}
            className="basis-[88%] pl-4"
          >
            <BankCard card={card} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export function cardName(card: Pick<BankCardData, "issuer" | "lastFour">) {
  return `${ISSUER_NAMES[card.issuer]} terminada en ${card.lastFour}`;
}

// Darker than the default skeleton so it shows on the page background.
export function CardCarouselSkeleton() {
  return (
    <div className="-mr-6 flex gap-4 overflow-hidden py-2" aria-hidden>
      <Skeleton className="aspect-[1.75] w-[88%] shrink-0 rounded-3xl bg-foreground/8" />
      <Skeleton className="aspect-[1.75] w-[88%] shrink-0 rounded-3xl bg-foreground/8" />
    </div>
  );
}
