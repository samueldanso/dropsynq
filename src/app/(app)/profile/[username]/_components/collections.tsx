import { useProfileBalances } from "@/hooks/use-profile-balances";
import type { CoinBalance } from "@/types/coin";

interface CollectionsProps {
	address: string;
}

export function Collections({ address }: CollectionsProps) {
	const { data: balances, isLoading, isError } = useProfileBalances(address);

	if (isLoading) return <div className="p-4">Loading collections...</div>;
	if (isError)
		return (
			<div className="p-4 text-destructive">Failed to load collections.</div>
		);

	// Show all coins that the user has balances for
	const collections = balances?.filter(
		(balance) => balance.coin && balance.amount.amountDecimal > 0,
	);

	if (!collections || collections.length === 0)
		return <div className="p-4">No collections found.</div>;

	return (
		<div className="space-y-2 p-4">
			{collections.map((balance: CoinBalance) => (
				<div key={balance.id} className="rounded border p-2">
					<div className="font-semibold">
						{balance.coin?.name} ({balance.coin?.symbol})
					</div>
					<div className="text-muted-foreground text-sm">
						Amount: {balance.amount.amountDecimal.toFixed(2)}
					</div>
				</div>
			))}
		</div>
	);
}
