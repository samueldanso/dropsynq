"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useRef } from "react";

interface HorizontalScrollerProps {
	children: ReactNode;
	title?: string;
}

export function HorizontalScroller({
	children,
	title,
}: HorizontalScrollerProps) {
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
		<div className="w-full">
			{title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
			<div className="relative">
				<button
					type="button"
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 rounded-full p-2 shadow hover:bg-accent transition disabled:opacity-30"
					onClick={scrollLeft}
					aria-label="Scroll left"
				>
					<ChevronLeft className="size-6" />
				</button>
				<div
					ref={scrollRef}
					className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
				>
					{children}
				</div>
				<button
					type="button"
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 rounded-full p-2 shadow hover:bg-accent transition disabled:opacity-30"
					onClick={scrollRight}
					aria-label="Scroll right"
				>
					<ChevronRight className="size-6" />
				</button>
			</div>
		</div>
	);
}
