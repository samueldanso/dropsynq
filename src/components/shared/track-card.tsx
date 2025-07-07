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
	const { ready, authenticated, login } =
		require("@privy-io/react-auth").usePrivy();

	const handleCardClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.closest("button") || target.closest("a")) return;
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
		if (handle) router.push(`/profile/${handle}`);
		else if (address) router.push(`/profile/${address}`);
	};

	// Flat card, no border/ring/bg, taller header
	return (
		<button
			type="button"
			className="group relative w-[220px] h-[300px] cursor-pointer rounded-xl bg-transparent transition-all duration-300 overflow-hidden flex flex-col shadow-none border-none"
			onClick={handleCardClick}
			onKeyUp={(e) => {
				if (e.key === "Enter" || e.key === " ") handleCardClick(e as any);
			}}
			aria-label={`View details for ${coin.name}`}
		>
			{/* Header: Cover + Play */}
			<div className="relative w-full h-[170px] bg-gradient-to-br from-slate-900 to-slate-800">
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
				{/* Play Overlay */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onPlay?.(coin);
					}}
					className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
					aria-label="Play preview"
				>
					<div className="flex items-center justify-center size-12 bg-white/20 backdrop-blur-sm rounded-full">
						<Play className="size-6 text-white ml-1" />
					</div>
				</button>
				{/* Symbol Badge */}
				<div className="absolute top-2 right-2">
					<span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
						{coin.symbol}
					</span>
				</div>
			</div>
			{/* Content */}
			<div className="flex-1 px-3 py-2 flex flex-col gap-2 justify-between bg-transparent">
				{/* Title */}
				<h3 className="font-bold text-base text-foreground line-clamp-1 text-left group-hover:text-primary transition-colors">
					{coin.name}
				</h3>
				{/* Artist */}
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					{coin.creatorProfile?.avatar?.previewImage?.medium && (
						<Image
							src={coin.creatorProfile.avatar.previewImage.medium}
							alt={coin.creatorProfile.handle || "creator avatar"}
							width={18}
							height={18}
							className="rounded-full"
						/>
					)}
					<button
						type="button"
						className="hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none text-xs"
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
				{/* Stats Row */}
				<div className="flex items-center gap-4 text-xs mt-1">
					<div className="flex items-center gap-1">
						<DollarSign className="size-4 text-green-500" />
						<span className="font-semibold text-green-500">
							{formatMarketCap(coin.marketCap)}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<Users className="size-4" />
						<span>{coin.uniqueHolders}</span>
					</div>
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
									window.location.origin + "/track/" + coin.address,
								);
							}
						}}
						className="size-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
						aria-label="Share"
					>
						<Share2 className="size-4" />
					</button>
				</div>
				{/* Buy Button */}
				<div className="mt-2">
					<button
						type="button"
						className="w-full py-1 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition"
						onClick={(e) => {
							e.stopPropagation();
							if (!authenticated) login();
							else router.push(`/track/${coin.address}`); // or trigger buy modal/flow
						}}
					>
						Buy
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
