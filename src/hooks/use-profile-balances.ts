import { useApiQuery } from "@/hooks/use-api-query";
import type { CoinBalance } from "@/types/coin";

export function useProfileBalances(username: string) {
	return useApiQuery<CoinBalance[]>(
		["profile-balances", username],
		`/api/user/balances/${username}`,
		{
			enabled: !!username,
		},
	);
}
