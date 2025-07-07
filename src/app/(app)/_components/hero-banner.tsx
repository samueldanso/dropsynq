"use client";

import { Button } from "@/components/ui/button";

interface TrendingBannerProps {
	onExploreClick: () => void;
}

export default function HeroBanner({ onExploreClick }: TrendingBannerProps) {
	return (
		<div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-6 backdrop-blur-xl">
			{/* Glassy background effects */}
			<div className="-top-6 -right-6 absolute size-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl" />
			<div className="-bottom-4 -left-4 absolute size-24 rounded-full bg-gradient-to-tr from-green-400/15 to-blue-400/15 blur-xl" />
			<div className="absolute top-1/3 right-1/3 size-16 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-lg" />

			{/* Subtle grid pattern overlay */}
			<div className="absolute inset-0 bg-[length:20px_20px] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]" />

			<div className="relative z-10">
				<h3 className="mb-2 font-bold text-foreground text-lg">
					Turn music into coins. Discover, trade & earn.
				</h3>
				<p className="mb-4 text-muted-foreground text-sm leading-relaxed">
					For Artirst - Launch tokenized song drops and connect with fans. For
					Fans - Discover and trade music coins from rising artists. - All on
					Zora.
				</p>
				<Button
					size="sm"
					className="bg-black font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
					onClick={onExploreClick}
				>
					Explore Trending
				</Button>
			</div>
		</div>
	);
}
