import { useQuery } from "@tanstack/react-query";
import { getCoin } from "@zoralabs/coins-sdk";
import type { Address } from "viem";

export function useCoin(address: string, chainId?: number) {
	return useQuery({
		queryKey: ["coin", address, chainId],
		queryFn: async () => {
			const response = await getCoin({
				address: address as Address,
				chain: chainId,
			});
			return response?.data?.zora20Token;
		},
		enabled: Boolean(address),
	});
}
