"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import { TrackCard } from "@/components/shared/track-card";

type CoinBalanceNode = NonNullable<
	GetProfileBalancesResponse["profile"]
>["coinBalances"]["edges"][0]["node"];

interface CollectionsProps {
	balances?: CoinBalanceNode[];
}

export function Collections({ balances }: CollectionsProps) {
	const collections = balances?.filter(
		(balance) =>
			balance.coin &&
			Number(balance.balance) > 0 &&
			balance.coin.mediaContent?.mimeType?.startsWith("audio/"),
	);

	if (!collections || collections.length === 0) {
		return (
			<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
				<p>No coins in your collection yet.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-1 md:grid-cols-3 lg:grid-cols-5">
			{collections.map((balance) => {
				if (!balance.coin) return null;
				// Only add fallback if zoraComments is present or possibly missing
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
				return <TrackCard key={balance.id} coin={coin} />;
			})}
		</div>
	);
}
