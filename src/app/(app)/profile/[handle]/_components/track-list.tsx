"use client";

import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";

interface TrackListProps {
	coins?: any[];
	onPlay?: (coin: any) => void;
	playerTrack?: any;
	isPlayerOpen?: boolean;
}

export function TrackList({
	coins,
	onPlay,
	playerTrack,
	isPlayerOpen,
}: TrackListProps) {
	// Filter for audio coins only
	const audioCoins = coins?.filter((coin) =>
		coin.mediaContent?.mimeType?.startsWith("audio/"),
	);

	if (!audioCoins) {
		return (
			<div className="grid gap-1 md:grid-cols-3 lg:grid-cols-5">
				<TrackCardSkeleton />
				<TrackCardSkeleton />
				<TrackCardSkeleton />
			</div>
		);
	}

	if (audioCoins.length === 0) {
		return (
			<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
				<p>This user hasn&apos;t posted any song yet.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-1 md:grid-cols-3 lg:grid-cols-5">
			{audioCoins.map((coin) => (
				<TrackCard
					key={coin.address}
					coin={coin}
					onPlay={onPlay}
					isPlaying={
						playerTrack &&
						playerTrack.audioUrl === coin.mediaContent?.originalUri &&
						isPlayerOpen
					}
				/>
			))}
		</div>
	);
}
