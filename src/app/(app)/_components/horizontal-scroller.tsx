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
		<div className="relative">
			<button
				type="button"
				className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-accent transition-all duration-200 disabled:opacity-30 border border-border/50"
				onClick={scrollLeft}
				aria-label="Scroll left"
			>
				<ChevronLeft className="size-5" />
			</button>
			<div
				ref={scrollRef}
				className="flex space-x-6 overflow-x-auto pb-6 no-scrollbar scroll-smooth px-1"
			>
				{children}
			</div>
			<button
				type="button"
				className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-accent transition-all duration-200 disabled:opacity-30 border border-border/50"
				onClick={scrollRight}
				aria-label="Scroll right"
			>
				<ChevronRight className="size-5" />
			</button>
		</div>
	);
}
