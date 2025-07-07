"use client";

import { useQuery } from "@tanstack/react-query";
import {
	type ExploreResponse,
	getCoinsMostValuable,
	getCoinsNew,
	getCoinsTopGainers,
} from "@zoralabs/coins-sdk";
import { useState } from "react";
import MusicPlayer from "@/components/shared/music-player";
import { TrackCard } from "@/components/shared/track-card";
import GenreFilter from "./_components/genre-filter";
import HeroBanner from "./_components/hero-banner";
import { HorizontalScroller } from "./_components/horizontal-scroller";

// Map explore response edges to coin objects
const mapEdges = (response: ExploreResponse) =>
	response.data?.exploreList?.edges?.map((edge) => edge.node) || [];

// Generate unique keys for skeleton placeholders
const generateSkeletonKeys = (count: number, prefix: string) =>
	Array.from({ length: count }, (_, i) => `${prefix}-${i}-${Date.now()}`);

export default function AppHomePage() {
	const [activeGenre, setActiveGenre] = useState("All");
	const [playerTrack, setPlayerTrack] = useState<any | null>(null);
	const [isPlayerOpen, setIsPlayerOpen] = useState(false);

	const { data: newestCoins = [], isLoading: loadingNew } = useQuery({
		queryKey: ["discover-coins", "newest"],
		queryFn: async () => mapEdges(await getCoinsNew()),
	});
	const { data: topGainers = [], isLoading: loadingGainers } = useQuery({
		queryKey: ["discover-coins", "top-gainers"],
		queryFn: async () => mapEdges(await getCoinsTopGainers()),
	});
	const { data: trendingCoins = [], isLoading: loadingTrending } = useQuery({
		queryKey: ["discover-coins", "trending"],
		queryFn: async () => mapEdges(await getCoinsMostValuable()),
	});

	function handleExploreClick() {}

	function handlePlay(coin: any) {
		setPlayerTrack({
			title: coin.name,
			artist: coin.creatorProfile?.handle || "Unknown",
			audioUrl: coin.mediaContent?.originalUri || "",
			coverUrl: coin.mediaContent?.previewImage?.medium || undefined,
		});
		setIsPlayerOpen(true);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="w-full max-w-6xl mx-auto pl-8 pr-4">
				<HeroBanner onExploreClick={handleExploreClick} />
				<div className="mt-2 mb-4">
					<GenreFilter
						activeGenre={activeGenre}
						onGenreChange={setActiveGenre}
					/>
				</div>
				<div className="mt-4">
					{/* Music Sections */}
					<div className="space-y-16">
						{/* Newest Drops */}
						<section>
							<div className="mt-4">
								<h2 className="text-[20px] font-bold text-foreground mb-3">
									Latest Releases
								</h2>
							</div>
							<HorizontalScroller cardsToShow={4}>
								{loadingNew
									? generateSkeletonKeys(6, "skeleton-new").map((key) => (
											<div key={key} className="w-[300px] flex-shrink-0" />
										))
									: newestCoins.map((coin) => (
											<TrackCard
												key={coin.address}
												coin={coin}
												onPlay={handlePlay}
											/>
										))}
							</HorizontalScroller>
						</section>

						{/* Top Gainers */}
						<section>
							<div className="mt-4">
								<h2 className="text-[20px] font-bold text-foreground mb-3">
									Trending Now
								</h2>
							</div>
							<HorizontalScroller cardsToShow={4}>
								{loadingGainers
									? generateSkeletonKeys(6, "skeleton-gainers").map((key) => (
											<div key={key} className="w-[300px] flex-shrink-0" />
										))
									: topGainers.map((coin) => (
											<TrackCard
												key={coin.address}
												coin={coin}
												onPlay={handlePlay}
											/>
										))}
							</HorizontalScroller>
						</section>

						{/* Most Valuable */}
						<section>
							<div className="mt-4">
								<h2 className="text-[20px] font-bold text-foreground mb-3">
									Top Charts
								</h2>
							</div>
							<HorizontalScroller cardsToShow={4}>
								{loadingTrending
									? generateSkeletonKeys(6, "skeleton-trending").map((key) => (
											<div key={key} className="w-[300px] flex-shrink-0" />
										))
									: trendingCoins.map((coin) => (
											<TrackCard
												key={coin.address}
												coin={coin}
												onPlay={handlePlay}
											/>
										))}
							</HorizontalScroller>
						</section>
					</div>
				</div>
			</div>

			{/* Music Player */}
			<MusicPlayer
				track={playerTrack}
				isOpen={isPlayerOpen && !!playerTrack}
				onClose={() => setIsPlayerOpen(false)}
			/>
		</div>
	);
}
