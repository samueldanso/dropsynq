import { useQuery } from "@tanstack/react-query";
import { getProfileBalances } from "@zoralabs/coins-sdk";
import { type CoinBalance } from "@/types/coin";

export function useProfileBalances(identifier: string) {
	return useQuery<CoinBalance[]>({
		queryKey: ["profile-balances", identifier],
		queryFn: async () => {
			const response = (await getProfileBalances({ identifier })) as any;
			// The balances are in response.data?.profile.coinBalances?.edges
			return response.data?.profile?.coinBalances?.edges.map((edge: any) => edge.node) || [];
		},
		enabled: Boolean(identifier),
	});
}
