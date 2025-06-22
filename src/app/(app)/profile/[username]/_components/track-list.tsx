// This component will be a list of tracks specifically for the profile page.

import { useProfileBalances } from "@/hooks/use-profile-balances";
import { type CoinBalance } from "@/types/coin";

interface TrackListProps {
	address: string;
}

export function TrackList({ address }: TrackListProps) {
	const { data: balances, isLoading, isError } = useProfileBalances(address);

	if (isLoading) return <div className="p-4">Loading drops...</div>;
	if (isError) return <div className="p-4 text-destructive">Failed to load drops.</div>;

	const drops = balances?.filter((balance) => balance.coin && balance.coin.owner === address);

	if (!drops || drops.length === 0) return <div className="p-4">No drops found.</div>;

	return (
		<div className="space-y-2 p-4">
			{drops.map((balance: CoinBalance) => (
				<div key={balance.id} className="rounded border p-2">
					<div className="font-semibold">
						{balance.coin?.name} ({balance.coin?.symbol})
					</div>
					<div className="text-muted-foreground text-sm">Amount: {balance.balance}</div>
				</div>
			))}
		</div>
	);
}
