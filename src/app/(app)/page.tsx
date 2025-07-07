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
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<HeroBanner onExploreClick={handleExploreClick} />
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				{/* Genre Filter */}
				<div className="mb-12">
					<GenreFilter
						activeGenre={activeGenre}
						onGenreChange={setActiveGenre}
					/>
				</div>

				{/* Music Sections */}
				<div className="space-y-16">
					{/* Newest Drops */}
					<section>
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Latest Releases
							</h2>
							<p className="text-muted-foreground">
								Discover the newest music drops from emerging artists
							</p>
						</div>
						<HorizontalScroller>
							{loadingNew
								? generateSkeletonKeys(6, "skeleton-new").map((key) => (
										<div key={key} className="w-64 flex-shrink-0" />
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
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Trending Now
							</h2>
							<p className="text-muted-foreground">
								The hottest tracks gaining momentum in the last 24 hours
							</p>
						</div>
						<HorizontalScroller>
							{loadingGainers
								? generateSkeletonKeys(6, "skeleton-gainers").map((key) => (
										<div key={key} className="w-64 flex-shrink-0" />
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
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Top Charts
							</h2>
							<p className="text-muted-foreground">
								The most valuable and sought-after music coins
							</p>
						</div>
						<HorizontalScroller>
							{loadingTrending
								? generateSkeletonKeys(6, "skeleton-trending").map((key) => (
										<div key={key} className="w-64 flex-shrink-0" />
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

			{/* Music Player */}
			<MusicPlayer
				track={playerTrack}
				isOpen={isPlayerOpen && !!playerTrack}
				onClose={() => setIsPlayerOpen(false)}
			/>
		</div>
	);
}
