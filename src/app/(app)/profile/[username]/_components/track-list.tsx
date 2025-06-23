// This component will be a list of tracks specifically for the profile page.

import { TrackCard } from "@/components/shared/track-card";
import { useProfileCoins } from "@/hooks/use-profile-coins";

interface TrackListProps {
	address: string;
}

export function TrackList({ address }: TrackListProps) {
	const { data: coins, isLoading, isError } = useProfileCoins(address);

	if (isLoading) return <div className="p-4">Loading tracks...</div>;
	if (isError)
		return <div className="p-4 text-destructive">Failed to load tracks.</div>;

	if (!coins || coins.length === 0)
		return <div className="p-4">No tracks found.</div>;

	return (
		<div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
			{coins.map((coin) => (
				<TrackCard key={coin.id} coin={coin} />
			))}
		</div>
	);
}
