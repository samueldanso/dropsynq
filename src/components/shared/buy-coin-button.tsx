"use client";

import { useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { toast } from "sonner";
import { parseEther } from "viem";
import { useConfig, useWriteContract } from "wagmi";
import { simulateContract } from "wagmi/actions";
import { Button } from "@/components/ui/button";
import { tradeCoinCall } from "@zoralabs/coins-sdk";

interface BuyCoinButtonProps {
  coinAddress: string;
  amount?: string; // Optional, default to "1"
}

export function BuyCoinButton({
  coinAddress,
  amount = "1",
}: BuyCoinButtonProps) {
  const { wallets } = useWallets();
  const config = useConfig();
  const { writeContractAsync, isPending } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const handleBuy = async () => {
    if (!embeddedWallet?.address) {
      toast.error("No connected wallet found.");
      return;
    }
    setIsLoading(true);
    try {
      const tradeParams = {
        direction: "buy",
        target: coinAddress as `0x${string}`,
        args: {
          recipient: embeddedWallet.address as `0x${string}`,
          orderSize: parseEther(amount),
        },
      };

      const contractCallParams = tradeCoinCall(tradeParams);

      const { request } = await simulateContract(config, {
        ...contractCallParams,
        value: parseEther(amount),
        account: embeddedWallet.address as `0x${string}`,
      });

      await writeContractAsync(request);

      toast.success("Successfully bought coin!");
    } catch (error) {
      console.error("Buy failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Buy execution failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuy}
      disabled
      className="w-full"
      title="Buy is temporarily disabled due to SDK issue."
    >
      Buy (Temporarily Disabled)
    </Button>
  );
}

export default BuyCoinButton;
