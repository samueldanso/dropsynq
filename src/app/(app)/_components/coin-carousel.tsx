"use client";

import { useQuery } from "@tanstack/react-query";
import type { ExploreResponse, GetCoinResponse } from "@zoralabs/coins-sdk";
import {
	getCoinsMostValuable,
	getCoinsNew,
	getCoinsTopGainers,
} from "@zoralabs/coins-sdk";
import { TrackCard, TrackCardSkeleton } from "@/components/shared/track-card";

interface CoinCarouselProps {
	title: string;
	type: "newest" | "trending" | "top-gainers";
}

type ZoraCoin = NonNullable<GetCoinResponse["zora20Token"]>;

export function CoinCarousel({ title, type }: CoinCarouselProps) {
	const {
		data: coins,
		isLoading,
		error,
	} = useQuery<ZoraCoin[]>({
		queryKey: ["discover-coins", type],
		queryFn: async () => {
			let response: ExploreResponse;

			switch (type) {
				case "newest":
					response = await getCoinsNew();
					break;
				case "top-gainers":
					response = await getCoinsTopGainers();
					break;
				case "trending":
					response = await getCoinsMostValuable();
					break;
				default:
					response = await getCoinsNew();
			}

			const coins =
				response.data?.exploreList?.edges?.map(
					(edge) =>
						({
							...edge.node,
							zoraComments: {
								pageInfo: { hasNextPage: false },
								count: 0,
								edges: [],
							},
						}) as ZoraCoin,
				) || [];

			return coins;
		},
	});

	if (error) {
		return (
			<div className="text-red-500">
				Could not load {title}: {error.message}
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">{title}</h2>
			<div className="relative">
				<div className="flex space-x-4 overflow-x-auto pb-4">
					{isLoading && (
						<>
							<TrackCardSkeleton />
							<TrackCardSkeleton />
							<TrackCardSkeleton />
							<TrackCardSkeleton />
						</>
					)}
					{coins?.map((coin) =>
						"zoraComments" in coin ? (
							<div key={coin.address} className="w-64 flex-shrink-0">
								<TrackCard coin={coin} />
							</div>
						) : null,
					)}
				</div>
			</div>
		</div>
	);
}
