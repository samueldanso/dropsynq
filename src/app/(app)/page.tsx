"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type ExploreResponse,
  getCoin,
  getCoinsMostValuable,
  getCoinsNew,
  getCoinsTopGainers,
} from "@zoralabs/coins-sdk";
import { useState } from "react";
import MusicPlayer from "@/components/shared/music-player";
import { TrackCard } from "@/components/shared/track-card";
import type { ZoraCoin } from "@/types/zora";
import GenreFilter from "./_components/genre-filter";
import HeroBanner from "./_components/hero-banner";
import { HorizontalScroller } from "./_components/horizontal-scroller";

// Map explore response edges to coin objects
const mapEdges = (response: ExploreResponse) =>
  response.data?.exploreList?.edges?.map((edge) => edge.node) || [];

// Generate unique keys for skeleton placeholders
const generateSkeletonKeys = (count: number, prefix: string) =>
  Array.from({ length: count }, (_, i) => `${prefix}-${i}-${Date.now()}`);

// Helper: filter for audio coins only
function filterAudioCoins(coins: any[]) {
  return coins.filter((coin) =>
    coin.mediaContent?.mimeType?.startsWith("audio/")
  );
}

// Map DB song to TrackCard coin shape
function mapDbSongToCoin(song: any) {
  return {
    address: song.coin_address,
    name: song.name,
    description: song.description,
    mediaContent: {
      originalUri: song.audio_url,
      mimeType: "audio/mpeg", // Assume mp3 for now
      previewImage: { medium: song.image_url },
    },
    creatorProfile: { handle: song.creator_address },
    createdAt: song.created_at,
    // Add more fields as needed
  };
}

// Utility to enrich DB coins with Zora SDK details
async function enrichCoinsWithZora(
  dbCoins: { coin_address: string }[]
): Promise<ZoraCoin[]> {
  return Promise.all(
    dbCoins.map(async (dbCoin) => {
      try {
        const res = await getCoin({ address: dbCoin.coin_address });
        return res.data?.zora20Token as ZoraCoin;
      } catch (e) {
        return null;
      }
    })
  ).then((coins) => coins.filter(Boolean) as ZoraCoin[]);
}

export default function AppHomePage() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [playerTrack, setPlayerTrack] = useState<any | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Fetch from DB endpoints
  const { data: dbRecent = [], isLoading: loadingDbRecent } = useQuery({
    queryKey: ["songs", "recent"],
    queryFn: async () => {
      const res = await fetch("/api/songs/recent");
      if (!res.ok) return [];
      return await res.json();
    },
  });
  const { data: dbTrending = [], isLoading: loadingDbTrending } = useQuery({
    queryKey: ["songs", "trending"],
    queryFn: async () => {
      const res = await fetch("/api/songs/trending");
      if (!res.ok) return [];
      return await res.json();
    },
  });
  const { data: dbTop = [], isLoading: loadingDbTop } = useQuery({
    queryKey: ["songs", "top"],
    queryFn: async () => {
      const res = await fetch("/api/songs/top");
      if (!res.ok) return [];
      return await res.json();
    },
  });

  // Fallback to Zora SDK if DB is empty
  const { data: newestCoins = [], isLoading: loadingNew } = useQuery({
    queryKey: ["discover-coins", "newest"],
    queryFn: async () => mapEdges(await getCoinsNew()),
    enabled: dbRecent.length === 0,
  });
  const { data: topGainers = [], isLoading: loadingGainers } = useQuery({
    queryKey: ["discover-coins", "top-gainers"],
    queryFn: async () => mapEdges(await getCoinsTopGainers()),
    enabled: dbTrending.length === 0,
  });
  const { data: trendingCoins = [], isLoading: loadingTrending } = useQuery({
    queryKey: ["discover-coins", "trending"],
    queryFn: async () => mapEdges(await getCoinsMostValuable()),
    enabled: dbTop.length === 0,
  });

  // Enrich DB coins with Zora SDK details
  const { data: enrichedRecent = [], isLoading: loadingEnrichedRecent } =
    useQuery({
      queryKey: ["enriched-coins", dbRecent],
      queryFn: () => enrichCoinsWithZora(dbRecent),
      enabled: dbRecent.length > 0,
    });
  const { data: enrichedTrending = [], isLoading: loadingEnrichedTrending } =
    useQuery({
      queryKey: ["enriched-coins", dbTrending],
      queryFn: () => enrichCoinsWithZora(dbTrending),
      enabled: dbTrending.length > 0,
    });
  const { data: enrichedTop = [], isLoading: loadingEnrichedTop } = useQuery({
    queryKey: ["enriched-coins", dbTop],
    queryFn: () => enrichCoinsWithZora(dbTop),
    enabled: dbTop.length > 0,
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

  // Prefer enriched DB data, fallback to Zora SDK
  const recentCoins = dbRecent.length > 0 ? enrichedRecent : newestCoins;
  const trending = dbTrending.length > 0 ? enrichedTrending : topGainers;
  const topCharts = dbTop.length > 0 ? enrichedTop : trendingCoins;

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
                {loadingEnrichedRecent && dbRecent.length === 0 && loadingNew
                  ? generateSkeletonKeys(6, "skeleton-new").map((key) => (
                      <div key={key} className="w-[300px] flex-shrink-0" />
                    ))
                  : filterAudioCoins(recentCoins).map((coin) => (
                      <TrackCard
                        key={coin.address}
                        coin={coin}
                        onPlay={handlePlay}
                        isPlaying={
                          playerTrack &&
                          playerTrack.audioUrl ===
                            coin.mediaContent?.originalUri &&
                          isPlayerOpen
                        }
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
                {loadingEnrichedTrending &&
                dbTrending.length === 0 &&
                loadingGainers
                  ? generateSkeletonKeys(6, "skeleton-gainers").map((key) => (
                      <div key={key} className="w-[300px] flex-shrink-0" />
                    ))
                  : filterAudioCoins(trending).map((coin) => (
                      <TrackCard
                        key={coin.address}
                        coin={coin}
                        onPlay={handlePlay}
                        isPlaying={
                          playerTrack &&
                          playerTrack.audioUrl ===
                            coin.mediaContent?.originalUri &&
                          isPlayerOpen
                        }
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
                {loadingEnrichedTop && dbTop.length === 0 && loadingTrending
                  ? generateSkeletonKeys(6, "skeleton-trending").map((key) => (
                      <div key={key} className="w-[300px] flex-shrink-0" />
                    ))
                  : filterAudioCoins(topCharts).map((coin) => (
                      <TrackCard
                        key={coin.address}
                        coin={coin}
                        onPlay={handlePlay}
                        isPlaying={
                          playerTrack &&
                          playerTrack.audioUrl ===
                            coin.mediaContent?.originalUri &&
                          isPlayerOpen
                        }
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
