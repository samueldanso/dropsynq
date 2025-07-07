"use client";

import type { GetCoinResponse } from "@zoralabs/coins-sdk";
import { Heart, MessageCircle, Play, Share2, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useLikeCount } from "@/hooks/use-social";
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
	const { likeCount } = useLikeCount({ coinAddress: coin.address });

	const handleCardClick = (e: React.MouseEvent) => {
		// Prevent click if play icon or button is clicked
		const target = e.target as HTMLElement;
		if (target.closest("button") || target.closest("a")) {
			return;
		}
		router.push(`/track/${coin.address}`);
	};

	return (
		<div className="group relative w-[300px] cursor-pointer rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border hover:bg-card/80 transition-all duration-300 overflow-hidden">
			{/* Cover Image + Play Overlay */}
			<div className="relative aspect-square w-full bg-gradient-to-br from-slate-900 to-slate-800">
				{coin.mediaContent?.previewImage?.medium ? (
					<Image
						src={coin.mediaContent.previewImage.medium}
						alt={coin.name}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Play className="size-16 text-white/30" />
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
					<div className="flex items-center justify-center size-14 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
						<Play className="size-6 text-white ml-1" />
					</div>
				</button>

				{/* Symbol Badge */}
				<div className="absolute top-3 right-3">
					<span className="rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/20">
						{coin.symbol}
					</span>
				</div>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			{/* Info Section */}
			<div className="p-5 space-y-3">
				{/* Title and Artist */}
				<div className="space-y-1">
					<h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
						{coin.name}
					</h3>
					<div className="flex items-center gap-2">
						{coin.creatorProfile?.avatar?.previewImage?.medium && (
							<Image
								src={coin.creatorProfile.avatar.previewImage.medium}
								alt={coin.creatorProfile.handle || "creator avatar"}
								width={16}
								height={16}
								className="rounded-full"
							/>
						)}
						<span className="text-sm text-muted-foreground">
							{coin.creatorProfile?.handle || "Unknown Artist"}
						</span>
					</div>
				</div>

				{/* Stats Row */}
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1">
							<Users className="size-3" />
							<span>{coin.uniqueHolders}</span>
						</div>
						<div className="flex items-center gap-1">
							<MessageCircle className="size-3" />
							<span>{coin.zoraComments?.count ?? 0}</span>
						</div>
						<div className="flex items-center gap-1">
							<Heart className="size-3" />
							<span>{likeCount}</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2 pt-2">
					<BuyCoinButton coinAddress={coin.address} amount="0.01" />
					<LikeButton
						coinAddress={coin.address}
						showCount={false}
						className="size-9 rounded-full"
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
						className="size-9 rounded-full bg-muted hover:bg-accent transition-colors flex items-center justify-center"
						aria-label="Share"
					>
						<Share2 className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}

// Skeleton component for loading state
export function TrackCardSkeleton() {
	return (
		<div className="relative w-[300px] rounded-2xl bg-card/50 border border-border/50 overflow-hidden">
			{/* Cover Image Skeleton */}
			<div className="relative aspect-square w-full bg-gradient-to-br from-slate-900 to-slate-800">
				<Skeleton className="absolute inset-0" />
				{/* Symbol Badge Skeleton */}
				<div className="absolute top-3 right-3">
					<Skeleton className="h-6 w-12 rounded-full" />
				</div>
			</div>

			{/* Info Section Skeleton */}
			<div className="p-5 space-y-3">
				<div className="space-y-1">
					<Skeleton className="h-5 w-40" />
					<div className="flex items-center gap-2">
						<Skeleton className="size-4 rounded-full" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Skeleton className="h-3 w-8" />
						<Skeleton className="h-3 w-8" />
						<Skeleton className="h-3 w-8" />
					</div>
				</div>
				<div className="flex items-center gap-2 pt-2">
					<Skeleton className="h-9 flex-1" />
					<Skeleton className="size-9 rounded-full" />
					<Skeleton className="size-9 rounded-full" />
				</div>
			</div>
		</div>
	);
}
