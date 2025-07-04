"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoin } from "@zoralabs/coins-sdk";
import Image from "next/image";
import BuyCoinButton from "@/components/shared/buy-coin-button";
import { Skeleton } from "@/components/ui/skeleton";
import { TradeCard } from "./trade-card";

interface TrackDetailsProps {
  id: string;
}

export default function TrackDetails({ id }: TrackDetailsProps) {
  const {
    data: coin,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["coin", id],
    queryFn: async () => {
      const response = await getCoin({ address: id as `0x${string}` });
      return response?.data?.zora20Token;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="size-80 rounded-lg" />
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !coin) {
    return <div className="text-center text-red-500">Track not found.</div>;
  }

  const anyCoin = coin as any;
  const image = anyCoin.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const audio = anyCoin.animation_url?.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );
  const artist = anyCoin.properties?.creator || coin.creatorAddress;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex flex-col items-center gap-6">
        {image && (
          <Image
            src={image}
            alt={coin.name || "cover"}
            width={320}
            height={320}
            className="rounded-lg"
          />
        )}
        <h1 className="text-3xl font-bold">{coin.name}</h1>
        <div className="text-lg text-muted-foreground">by {artist}</div>
        <div className="text-base text-center mb-4">{coin.description}</div>
        {audio && (
          <audio controls src={audio} className="w-full">
            <track kind="captions" />
            Your browser does not support the audio element.
          </audio>
        )}
        <div className="mt-6 w-full grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">Symbol</div>
            <div className="font-mono">{coin.symbol}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Supply</div>
            <div>{coin.totalSupply}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Holders</div>
            <div>{coin.uniqueHolders}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Contract</div>
            <a
              href={`https://basescan.org/address/${coin.address}`}
              target="_blank"
              rel="noopener"
              className="underline text-blue-500"
            >
              {coin.address?.slice(0, 8)}...{coin.address?.slice(-4)}
            </a>
          </div>
        </div>
        <TradeCard coinAddress={id} />
        <div className="mt-4">
          <BuyCoinButton coinAddress={id} />
        </div>
      </div>
    </div>
  );
}
