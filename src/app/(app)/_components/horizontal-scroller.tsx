"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useRef } from "react";

interface HorizontalScrollerProps {
	children: ReactNode;
}

export function HorizontalScroller({ children }: HorizontalScrollerProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	function scrollLeft() {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
		}
	}
	function scrollRight() {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
		}
	}

	return (
		<div className="relative w-full flex justify-center overflow-x-hidden">
			<div className="relative max-w-screen-xl w-full flex items-center">
				<button
					type="button"
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 rounded-full shadow p-2 border border-border hover:bg-accent transition-all"
					onClick={scrollLeft}
					aria-label="Scroll left"
					style={{ left: -32 }}
				>
					<ChevronLeft className="size-6" />
				</button>
				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 md:px-6 py-2 w-full"
					style={{
						scrollSnapType: "x mandatory",
						WebkitOverflowScrolling: "touch",
						maxWidth: "100%",
						overflowX: "auto",
					}}
				>
					{children}
				</div>
				<button
					type="button"
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 rounded-full shadow p-2 border border-border hover:bg-accent transition-all"
					onClick={scrollRight}
					aria-label="Scroll right"
					style={{ right: -32 }}
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
