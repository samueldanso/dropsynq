"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  useState,
} from "react";

interface HorizontalScrollerProps {
  children: ReactNode;
  cardsToShow?: number; // default 4
}

export function HorizontalScroller({
  children,
  cardsToShow = 5,
}: HorizontalScrollerProps) {
  const allCards = Children.toArray(children).filter(isValidElement);
  const [startIndex, setStartIndex] = useState(0);
  const total = allCards.length;
  const maxStart = Math.max(0, total - cardsToShow);

  function scrollLeft() {
    setStartIndex((prev) => Math.max(0, prev - 1));
  }
  function scrollRight() {
    setStartIndex((prev) => Math.min(maxStart, prev + 1));
  }

  const visibleCards = allCards.slice(startIndex, startIndex + cardsToShow);

  return (
    <div className="relative w-full flex items-center justify-start">
      {/* Cards Row (relative for overlay) */}
      <div className="flex gap-0.5 w-full justify-start items-stretch relative">
        {visibleCards.map((card, idx) => {
          // Overlay left arrow on first visible card
          if (idx === 0 && startIndex > 0) {
            return (
              <div
                key={card.key ?? idx}
                className="relative"
                style={{ width: 220, minWidth: 220, maxWidth: 220 }}
              >
                {cloneElement(card as any)}
                <button
                  type="button"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 rounded-full shadow p-2 hover:bg-accent transition-all"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  style={{ marginLeft: -24 }}
                >
                  <ChevronLeft className="size-6" />
                </button>
              </div>
            );
          }
          // Overlay right arrow on last visible card
          if (idx === visibleCards.length - 1 && startIndex < maxStart) {
            return (
              <div
                key={card.key ?? idx}
                className="relative"
                style={{ width: 220, minWidth: 220, maxWidth: 220 }}
              >
                {cloneElement(card as any)}
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 rounded-full shadow p-2 hover:bg-accent transition-all"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  style={{ marginRight: -24 }}
                >
                  <ChevronRight className="size-6" />
                </button>
              </div>
            );
          }
          // Normal card
          return cloneElement(card as any, {
            key: card.key ?? idx,
            style: { width: 220, minWidth: 220, maxWidth: 220 },
          });
        })}
      </div>
    </div>
  );
}

// Hide native scrollbar utility (Tailwind v4: add to globals if not present)
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
