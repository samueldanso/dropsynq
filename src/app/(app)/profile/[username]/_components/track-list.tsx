"use client";

// This component will be a list of tracks specifically for the profile page.

import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";
import { useProfileTracks } from "@/hooks/use-profile-tracks";

interface TrackListProps {
	username: string;
}

export function TrackList({ username }: TrackListProps) {
	const { data: tracks, isLoading } = useProfileTracks(username);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<TrackCardSkeleton />
				<TrackCardSkeleton />
				<TrackCardSkeleton />
			</div>
		);
	}

	if (!tracks || tracks.length === 0) {
		return (
			<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
				<p>This user hasn't created any tracks yet.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{tracks.map((track) => (
				<TrackCard key={track.id} coin={track} />
			))}
		</div>
	);
}
