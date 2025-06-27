"use client";

// This component will be a list of tracks specifically for the profile page.

import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";
import { useProfileTracks } from "@/hooks/use-profile-tracks";

interface TrackListProps {
	username: string;
}

export function TrackList({ username }: TrackListProps) {
	const { data: coins, isLoading } = useProfileTracks(username);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<TrackCardSkeleton />
				<TrackCardSkeleton />
				<TrackCardSkeleton />
			</div>
		);
	}

	if (!coins || coins.length === 0) {
		return (
			<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
				<p>This user hasn't created any tracks yet.</p>
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
