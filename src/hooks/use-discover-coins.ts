import { useApiQuery } from "@/hooks/use-api-query";
import type { ZoraCoin } from "@/types/coin";

interface UseDiscoverCoinsOptions {
	type: "top-gainers" | "top-volume" | "most-valuable" | "newest";
}

export function useDiscoverCoins({ type }: UseDiscoverCoinsOptions) {
	const {
		data: coins,
		isLoading,
		error,
	} = useApiQuery<ZoraCoin[]>(
		["discover-coins", type],
		`/api/discover?type=${type}`,
	);

	return { coins, isLoading, error };
}
