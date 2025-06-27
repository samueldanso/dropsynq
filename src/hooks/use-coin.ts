import { useQuery } from "@tanstack/react-query";
import { getCoin } from "@zoralabs/coins-sdk";
import { baseSepolia } from "viem/chains";

interface UseCoinArgs {
	coinAddress?: string;
}

export function useCoin({ coinAddress }: UseCoinArgs) {
	return useQuery({
		queryKey: ["coin", coinAddress],
		queryFn: async () => {
			if (!coinAddress) {
				throw new Error("Coin address is required");
			}
			const response = await getCoin({
				address: coinAddress,
				chain: baseSepolia.id,
			});
			return response.data?.zora20Token;
		},
		enabled: !!coinAddress,
	});
}
