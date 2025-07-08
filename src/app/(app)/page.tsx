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
      {/* Hero Section + Filters + Music Sections */}
      <div className="w-full max-w-6xl mx-auto px-4 mt-4">
        <div className="flex flex-col space-y-10">
          <HeroBanner onExploreClick={handleExploreClick} />
          <GenreFilter
            activeGenre={activeGenre}
            onGenreChange={setActiveGenre}
          />
          <div className="space-y-12">
            {/* Newest Drops */}
            <section>
              <h2 className="text-[20px] font-bold text-foreground mb-3 mt-2">
                Latest Releases
              </h2>
              <HorizontalScroller cardsToShow={5}>
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
              <h2 className="text-[20px] font-bold text-foreground mb-3 mt-2">
                Trending Now
              </h2>
              <HorizontalScroller cardsToShow={5}>
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
              <h2 className="text-[20px] font-bold text-foreground mb-3 mt-2">
                Top Charts
              </h2>
              <HorizontalScroller cardsToShow={5}>
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
