"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import { useState } from "react";
import MusicPlayer from "@/components/shared/music-player";
import { TrackCard } from "@/components/shared/track-card";

type CoinBalanceNode = NonNullable<
  GetProfileBalancesResponse["profile"]
>["coinBalances"]["edges"][0]["node"];

interface CollectionsProps {
  balances?: CoinBalanceNode[];
  playerTrack?: any;
  isPlayerOpen?: boolean;
  onPlay?: (coin: any) => void;
}

export function Collections({
  balances,
  playerTrack,
  isPlayerOpen,
  onPlay,
}: CollectionsProps) {
  // Use local state only if not controlled by parent
  const [localPlayerTrack, setLocalPlayerTrack] = useState<any | null>(null);
  const [localIsPlayerOpen, setLocalIsPlayerOpen] = useState(false);

  const collections = balances?.filter(
    (balance) =>
      balance.coin &&
      Number(balance.balance) > 0 &&
      balance.coin.mediaContent?.mimeType?.startsWith("audio/")
  );

  if (!collections || collections.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>No coins in your collection yet.</p>
      </div>
    );
  }

  function handlePlay(coin: any) {
    if (onPlay) return onPlay(coin);
    setLocalPlayerTrack({
      title: coin.name,
      artist: coin.creatorProfile?.handle || "Unknown",
      audioUrl: coin.mediaContent?.originalUri || "",
      coverUrl: coin.mediaContent?.previewImage?.medium || undefined,
    });
    setLocalIsPlayerOpen(true);
  }

  const currentTrack = playerTrack ?? localPlayerTrack;
  const open = isPlayerOpen ?? localIsPlayerOpen;

  return (
    <>
      <div className="grid gap-1 md:grid-cols-3 lg:grid-cols-5">
        {collections.map((balance) => {
          if (!balance.coin) return null;
          const coin =
            "zoraComments" in balance.coin
              ? balance.coin
              : {
                  ...balance.coin,
                  zoraComments: {
                    pageInfo: { hasNextPage: false },
                    count: 0,
                    edges: [],
                  } as any,
                };
          return (
            <TrackCard
              key={balance.id}
              coin={coin}
              onPlay={handlePlay}
              isPlaying={
                currentTrack &&
                currentTrack.audioUrl === coin.mediaContent?.originalUri &&
                open
              }
            />
          );
        })}
      </div>
      <MusicPlayer
        track={currentTrack}
        isOpen={open && !!currentTrack}
        onClose={() => {
          if (onPlay) return; // parent controls closing
          setLocalIsPlayerOpen(false);
        }}
      />
    </>
  );
}
