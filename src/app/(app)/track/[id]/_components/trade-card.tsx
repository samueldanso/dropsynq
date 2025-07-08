"use client";

import { type TradeParameters, tradeCoin } from "@zoralabs/coins-sdk";
import { useState } from "react";
import { createPublicClient, http, parseEther } from "viem";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";
import BuyCoinButton from "@/components/shared/buy-button";
import { Button } from "@/components/ui/button";

const PLATFORM_REFERRER = "0xA44Fa8Ad3e905C8AB525cd0cb14319017F1e04e5";
const SLIPPAGE = 0.05;

interface TradeCardProps {
	coinAddress: string;
}

export function TradeCard({ coinAddress }: TradeCardProps) {
	const { data: walletClient } = useWalletClient();
	const [isPending, setIsPending] = useState(false);
	const [direction, setDirection] = useState<"buy" | "sell">("buy");
	const [amount, setAmount] = useState("");
	const [txStatus, setTxStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const isBase = walletClient?.chain?.id === base.id;

	const handleTrade = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setTxStatus(null);
		if (!walletClient || !walletClient.account) {
			setError("Connect your wallet to trade");
			return;
		}
		if (!isBase) {
			setError("Switch to Base Mainnet to trade");
			return;
		}
		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			setError("Enter a valid amount");
			return;
		}
		setIsPending(true);
		try {
			const publicClient = createPublicClient({
				chain: base,
				transport: http(),
			});
			const tradeParameters: TradeParameters =
				direction === "buy"
					? {
							sell: { type: "eth" as const },
							buy: {
								type: "erc20" as const,
								address: coinAddress as `0x${string}`,
							},
							amountIn: parseEther(amount),
							slippage: SLIPPAGE,
							sender: walletClient.account.address,
							recipient: walletClient.account.address,
						}
					: {
							sell: {
								type: "erc20" as const,
								address: coinAddress as `0x${string}`,
							},
							buy: { type: "eth" as const },
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
			setError(err?.message || "Trade failed");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className="p-4 border rounded-lg bg-background w-full">
			<div className="mb-4 text-sm text-muted-foreground">
				Trading is only available on Base Mainnet.
			</div>
			<div className="mb-4 flex gap-2">
				<Button
					type="button"
					variant={direction === "buy" ? "default" : "secondary"}
					onClick={() => setDirection("buy")}
					disabled={isPending}
				>
					Buy
				</Button>
				<Button
					type="button"
					variant={direction === "sell" ? "default" : "secondary"}
					onClick={() => setDirection("sell")}
					disabled={isPending}
				>
					Sell
				</Button>
			</div>
			<form onSubmit={handleTrade} className="space-y-4 mt-4">
				<input
					type="number"
					step="any"
					min="0"
					placeholder={
						direction === "buy" ? "Amount in ETH" : "Amount of Coins"
					}
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="w-full border rounded px-3 py-2"
					disabled={isPending}
				/>
				<Button
					type="submit"
					className="w-full"
					disabled={isPending || !isBase}
				>
					{isPending ? "Processing..." : direction === "buy" ? "Buy" : "Sell"}
				</Button>
			</form>
			{txStatus && (
				<div className="mt-2 text-green-600 text-sm">{txStatus}</div>
			)}
			{error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
			<div className="mt-4">
				<BuyCoinButton coinAddress={coinAddress} />
			</div>
		</div>
	);
}
