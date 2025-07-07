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
	cardsToShow = 4,
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
		<div className="relative w-full flex justify-center overflow-x-hidden">
			<div className="relative flex items-center w-[1340px] max-w-full">
				<button
					type="button"
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 rounded-full shadow p-2 border border-border hover:bg-accent transition-all"
					onClick={scrollLeft}
					aria-label="Scroll left"
					disabled={startIndex === 0}
				>
					<ChevronLeft className="size-6" />
				</button>
				<div className="flex gap-6 w-full justify-center items-stretch">
					{visibleCards.map((card, idx) =>
						cloneElement(card as any, {
							key: card.key ?? idx,
							style: { width: 320, minWidth: 320, maxWidth: 320 },
						}),
					)}
				</div>
				<button
					type="button"
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 rounded-full shadow p-2 border border-border hover:bg-accent transition-all"
					onClick={scrollRight}
					aria-label="Scroll right"
					disabled={startIndex === maxStart}
				>
					<ChevronRight className="size-6" />
				</button>
			</div>
		</div>
	);
}

// Hide native scrollbar utility (Tailwind v4: add to globals if not present)
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
