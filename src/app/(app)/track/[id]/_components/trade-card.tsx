"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useWallets } from "@privy-io/react-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseEther } from "viem";
import { useBalance, useConfig, useWriteContract } from "wagmi";
import { simulateContract } from "wagmi/actions";
import { z } from "zod";
import { BuyCoinButton } from "@/components/shared/buy-coin-button";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tradeFormSchema = z.object({
	amount: z.string().min(1, "An amount is required"),
});

type TradeFormValues = z.infer<typeof tradeFormSchema>;

interface TradeCardProps {
	coinAddress: string;
}

export function TradeCard({ coinAddress }: TradeCardProps) {
	const { wallets } = useWallets();
	const config = useConfig();

	const embeddedWallet = wallets.find(
		(wallet) => wallet.walletClientType === "privy",
	);

	const shouldFetchBalance = !!embeddedWallet?.address && !!coinAddress;
	const { data: balanceData, isLoading: isBalanceLoading } = useBalance(
		shouldFetchBalance
			? {
					address: embeddedWallet.address as `0x${string}`,
					token: coinAddress as `0x${string}`,
				}
			: { address: undefined, token: undefined },
	);

	const form = useForm<TradeFormValues>({
		resolver: zodResolver(tradeFormSchema),
		defaultValues: { amount: "0" },
	});

	const { writeContractAsync, isPending } = useWriteContract();

	const onSubmit = async (
		values: TradeFormValues,
		direction: "buy" | "sell",
	) => {
		if (!embeddedWallet?.address) {
			toast.error("No connected wallet found.");
			return;
		}

		toast.info("Trading is temporarily disabled due to SDK issue.");
		return;
		/*
		try {
			const tradeParams = {
				direction,
				target: coinAddress as `0x${string}`,
				args: {
					recipient: embeddedWallet.address as `0x${string}`,
					orderSize: parseEther(values.amount),
				},
			};

			const contractCallParams = await tradeCoinCall(tradeParams);

			const { request } = await simulateContract(config, {
				...contractCallParams,
				value: direction === "buy" ? parseEther(values.amount) : BigInt(0),
				account: embeddedWallet.address as `0x${string}`,
			});

			await writeContractAsync(request);

			toast.success(`Successfully executed ${direction} order!`);
		} catch (error) {
			console.error("Trade failed:", error);
			toast.error(
				error instanceof Error ? error.message : "Trade execution failed",
			);
		}
		*/
	};

	return (
		<div className="p-4 border rounded-lg bg-background w-full">
			<div className="mb-4 text-sm text-muted-foreground">
				Your Balance:{" "}
				{isBalanceLoading
					? "..."
					: `${balanceData?.formatted || "0"} ${balanceData?.symbol || ""}`}
			</div>
			<Tabs defaultValue="buy" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="buy">Buy</TabsTrigger>
					<TabsTrigger value="sell">Sell</TabsTrigger>
				</TabsList>

				<Form {...form}>
					<TabsContent value="buy">
						<form
							onSubmit={form.handleSubmit((values) => onSubmit(values, "buy"))}
							className="space-y-4 mt-4"
						>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount in ETH</FormLabel>
										<FormControl>
											<Input
												placeholder="0.0"
												type="number"
												step="any"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Processing..." : "Buy"}
							</Button>
						</form>
					</TabsContent>
					<TabsContent value="sell">
						<form
							onSubmit={form.handleSubmit((values) => onSubmit(values, "sell"))}
							className="space-y-4 mt-4"
						>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount of Coins</FormLabel>
										<FormControl>
											<Input
												placeholder="0.0"
												type="number"
												step="any"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Processing..." : "Sell"}
							</Button>
						</form>
					</TabsContent>
				</Form>
			</Tabs>
			<div className="mt-4">
				<BuyCoinButton coinAddress={coinAddress} />
			</div>
		</div>
	);
}
