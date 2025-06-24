"use client";

import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";
import { useDiscoverCoins } from "@/hooks/use-discover-coins";

interface CoinCarouselProps {
	title: string;
	type: "top-gainers" | "top-volume" | "most-valuable" | "newest";
}

export function CoinCarousel({ title, type }: CoinCarouselProps) {
	const { coins, isLoading, error } = useDiscoverCoins({ type });

	if (error) {
		return (
			<div className="text-red-500">
				Could not load {title}: {error.message}
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">{title}</h2>
			<div className="relative">
				<div className="flex space-x-4 overflow-x-auto pb-4">
					{isLoading && (
						<>
							<TrackCardSkeleton />
							<TrackCardSkeleton />
							<TrackCardSkeleton />
							<TrackCardSkeleton />
						</>
					)}
					{coins?.map((coin) => (
						<div key={coin.address} className="w-64 flex-shrink-0">
							<TrackCard coin={coin} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
