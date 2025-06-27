import { formatEther } from "viem";
import { useBalance } from "wagmi";

interface UseCoinBalanceArgs {
	coinAddress?: `0x${string}`;
	userAddress?: `0x${string}`;
}

export function useCoinBalance({
	coinAddress,
	userAddress,
}: UseCoinBalanceArgs) {
	const {
		data: balanceData,
		isLoading,
		error,
	} = useBalance({
		address: userAddress,
		token: coinAddress,
		query: {
			// Only run the query if both addresses are provided
			enabled: !!userAddress && !!coinAddress,
		},
	});

	// Format the balance for display, e.g., "123.45"
	const formattedBalance = balanceData
		? parseFloat(formatEther(balanceData.value)).toFixed(2)
		: "0.00";

	return {
		balance: formattedBalance,
		symbol: balanceData?.symbol,
		isLoading,
		error,
	};
}
