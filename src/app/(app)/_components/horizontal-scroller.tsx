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
		<div className="relative w-full flex items-center justify-start gap-3">
			{/* Left Arrow */}
			<button
				type="button"
				className="z-10 bg-card/80 rounded-full shadow p-2 border border-border hover:bg-accent transition-all disabled:opacity-40"
				onClick={scrollLeft}
				aria-label="Scroll left"
				disabled={startIndex === 0}
				style={{ marginRight: 8 }}
			>
				<ChevronLeft className="size-6" />
			</button>
			{/* Cards Row */}
			<div className="flex gap-3 w-full justify-start items-stretch">
				{visibleCards.map((card, idx) =>
					cloneElement(card as any, {
						key: card.key ?? idx,
						style: { width: 220, minWidth: 220, maxWidth: 220 },
					}),
				)}
			</div>
			{/* Right Arrow */}
			<button
				type="button"
				className="z-10 bg-card/80 rounded-full shadow p-2 border border-border hover:bg-accent transition-all disabled:opacity-40"
				onClick={scrollRight}
				aria-label="Scroll right"
				disabled={startIndex === maxStart}
				style={{ marginLeft: 8 }}
			>
				<ChevronRight className="size-6" />
			</button>
		</div>
	);
}

// Hide native scrollbar utility (Tailwind v4: add to globals if not present)
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
