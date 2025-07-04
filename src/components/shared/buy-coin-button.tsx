"use client";

import { type TradeParameters, tradeCoin } from "@zoralabs/coins-sdk";
import { useState } from "react";
import { createPublicClient, http, parseEther } from "viem";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";

const PLATFORM_REFERRER = "0xA44Fa8Ad3e905C8AB525cd0cb14319017F1e04e5";
const SLIPPAGE = 0.05;

interface BuyCoinButtonProps {
	coinAddress: string;
	amount?: string; // Optional, default to "0.01"
}

export default function BuyCoinButton({
	coinAddress,
	amount = "0.01",
}: BuyCoinButtonProps) {
	const { data: walletClient } = useWalletClient();
	const [isLoading, setIsLoading] = useState(false);
	const [txStatus, setTxStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const isBase = walletClient?.chain?.id === base.id;

	const handleBuy = async () => {
		setError(null);
		setTxStatus(null);
		if (!walletClient || !walletClient.account) {
			setError("Connect your wallet to buy");
			return;
		}
		if (!isBase) {
			setError("Switch to Base Mainnet to buy");
			return;
		}
		setIsLoading(true);
		try {
			const publicClient = createPublicClient({
				chain: base,
				transport: http(),
			});
			const tradeParameters: TradeParameters = {
				sell: { type: "eth" as const },
				buy: { type: "erc20" as const, address: coinAddress as `0x${string}` },
				amountIn: parseEther(amount),
				slippage: SLIPPAGE,
				sender: walletClient.account.address,
				recipient: walletClient.account.address,
			};
			const result = await tradeCoin({
				tradeParameters,
				walletClient,
				account: walletClient.account,
				publicClient,
			});
			setTxStatus(`Success! Tx: ${result.hash}`);
		} catch (err: any) {
			setError(err?.message || "Buy failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button
				onClick={handleBuy}
				disabled={isLoading || !isBase}
				className="w-full bg-primary text-primary-foreground py-2 rounded"
				title={!isBase ? "Switch to Base Mainnet to buy" : ""}
			>
				{isLoading ? "Processing..." : `Buy ${amount} ETH worth`}
			</Button>
			{txStatus && (
				<div className="mt-2 text-green-600 text-sm">{txStatus}</div>
			)}
			{error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
		</div>
	);
}
