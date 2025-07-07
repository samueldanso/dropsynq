"use client";

import type { GetCoinResponse } from "@zoralabs/coins-sdk";
import {
  DollarSign,
  Heart,
  MessageCircle,
  Play,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import BuyCoinButton from "./buy-coin-button";
import { LikeButton } from "./like-button";

// Base coin type that works for both GetCoinResponse and explore responses
type BaseCoin = {
  id: string;
  name: string;
  description: string;
  address: string;
  symbol: string;
  totalSupply: string;
  totalVolume: string;
  volume24h: string;
  createdAt?: string;
  creatorAddress?: string;
  marketCap: string;
  marketCapDelta24h: string;
  chainId: number;
  tokenUri?: string;
  platformReferrerAddress?: string;
  payoutRecipientAddress?: string;
  creatorProfile?: {
    id: string;
    handle: string;
    avatar?: {
      previewImage: {
        blurhash?: string;
        medium: string;
        small: string;
      };
    };
  };
  mediaContent?: {
    mimeType?: string;
    originalUri: string;
    previewImage?: {
      small: string;
      medium: string;
      blurhash?: string;
    };
  };
  uniqueHolders: number;
  uniswapV4PoolKey: {
    token0Address: string;
    token1Address: string;
    fee: number;
    tickSpacing: number;
    hookAddress: string;
  };
  uniswapV3PoolAddress: string;
  // Optional zoraComments for GetCoinResponse
  zoraComments?: {
    count: number;
    edges: Array<{
      node: {
        txHash: string;
        comment: string;
        userAddress: string;
        timestamp: number;
        userProfile?: {
          id: string;
          handle: string;
          avatar?: {
            previewImage: {
              blurhash?: string;
              small: string;
              medium: string;
            };
          };
        };
      };
    }>;
    pageInfo: {
      endCursor?: string;
      hasNextPage: boolean;
    };
  };
};

interface TrackCardProps {
  coin: BaseCoin;
  onPlay?: (coin: BaseCoin) => void;
}

export function TrackCard({ coin, onPlay }: TrackCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if play icon or button is clicked
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/track/${coin.address}`);
  };

  function formatMarketCap(mcap: string) {
    const num = Number(mcap);
    if (isNaN(num)) return "-";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  }

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const handle = coin.creatorProfile?.handle;
    const address = coin.creatorAddress;
    if (handle) {
      router.push(`/profile/${handle}`);
    } else if (address) {
      router.push(`/profile/${address}`);
    }
  };

  return (
    <button
      type="button"
      className="group relative w-[220px] h-[260px] cursor-pointer rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border hover:bg-card/80 transition-all duration-300 overflow-hidden flex flex-col"
      onClick={handleCardClick}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick(e as any);
      }}
      aria-label={`View details for ${coin.name}`}
    >
      {/* Cover Image + Play Overlay */}
      <div className="relative w-full h-[140px] bg-gradient-to-br from-slate-900 to-slate-800">
        {coin.mediaContent?.previewImage?.medium ? (
          <Image
            src={coin.mediaContent.previewImage.medium}
            alt={coin.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Play className="size-12 text-white/30" />
          </div>
        )}

        {/* Play Icon Overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.(coin);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label="Play preview"
        >
          <div className="flex items-center justify-center size-10 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Play className="size-5 text-white ml-1" />
          </div>
        </button>

        {/* Symbol Badge */}
        <div className="absolute top-2 right-2">
          <span className="rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
            {coin.symbol}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Section */}
      <div className="flex-1 p-3 space-y-2 flex flex-col justify-between">
        {/* Title and Artist */}
        <div className="space-y-0.5">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {coin.name}
          </h3>
          <div className="flex items-center gap-1">
            {coin.creatorProfile?.avatar?.previewImage?.medium && (
              <Image
                src={coin.creatorProfile.avatar.previewImage.medium}
                alt={coin.creatorProfile.handle || "creator avatar"}
                width={14}
                height={14}
                className="rounded-full"
              />
            )}
            <button
              type="button"
              className="text-xs text-muted-foreground hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none"
              onClick={handleArtistClick}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleArtistClick(e as any);
              }}
              tabIndex={0}
              aria-label="View artist profile"
            >
              {coin.creatorProfile?.handle || "Unknown Artist"}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Users className="size-3" />
              <span>{coin.uniqueHolders}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <DollarSign className="size-3" />
              <span>{formatMarketCap(coin.marketCap)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pt-1">
          <BuyCoinButton coinAddress={coin.address} amount="0.01" />
          <LikeButton
            coinAddress={coin.address}
            showCount={false}
            className="size-7 rounded-full"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: coin.name,
                  url: window.location.origin + "/track/" + coin.address,
                });
              } else {
                navigator.clipboard.writeText(
                  window.location.origin + "/track/" + coin.address
                );
              }
            }}
            className="size-7 rounded-full bg-muted hover:bg-accent transition-colors flex items-center justify-center"
            aria-label="Share"
          >
            <Share2 className="size-3" />
          </button>
        </div>
      </div>
    </button>
  );
}

// Skeleton component for loading state
export function TrackCardSkeleton() {
  return (
    <div className="w-[220px] h-[260px] rounded-xl bg-muted/40 border border-border/30 flex flex-col overflow-hidden animate-pulse">
      <div className="w-full h-[140px] bg-muted/60" />
      <div className="flex-1 p-3 flex flex-col gap-2 justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-6 rounded" />
          <Skeleton className="h-3 w-6 rounded" />
          <Skeleton className="h-3 w-6 rounded" />
        </div>
        <div className="flex items-center gap-1 pt-1">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}
