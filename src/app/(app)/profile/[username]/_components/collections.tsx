"use client";

import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileBalances } from "@/hooks/use-profile-balances";
import type { CoinBalance } from "@/types/coin";

interface CollectionsProps {
	username: string;
}

export function Collections({ username }: CollectionsProps) {
	const { data: balances, isLoading } = useProfileBalances(username);

	const collections = balances?.filter(
		(balance) => balance.coin && balance.amount.amountDecimal > 0,
	);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<TrackCardSkeleton />
				<TrackCardSkeleton />
				<TrackCardSkeleton />
			</div>
		);
	}

	if (!collections || collections.length === 0) {
		return (
			<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
				<p>This user's collection is empty.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{collections.map((balance: CoinBalance) => (
				<TrackCard key={balance.id} coin={balance.coin!} />
			))}
		</div>
	);
}
