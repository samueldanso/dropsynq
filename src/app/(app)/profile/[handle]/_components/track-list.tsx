"use client";

import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";
import type { ZoraCoin } from "@/types/zora";

interface TrackListProps {
  coins?: ZoraCoin[];
}

export function TrackList({ coins }: TrackListProps) {
  if (!coins) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TrackCardSkeleton />
        <TrackCardSkeleton />
        <TrackCardSkeleton />
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>This user hasn&apos;t posted any song yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coins.map((coin) => (
        <TrackCard key={coin.address} coin={coin} />
      ))}
    </div>
  );
}
