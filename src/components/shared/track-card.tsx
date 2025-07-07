"use client";

import type { GetCoinResponse } from "@zoralabs/coins-sdk";
import { Heart, MessageCircle, Play, Share2, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
		<button
			type="button"
			className="group relative w-56 cursor-pointer rounded-xl bg-muted/60 shadow-sm hover:shadow-lg transition overflow-hidden text-left"
			onClick={handleCardClick}
		>
			{/* Cover Image + Play Overlay */}
			<div className="relative aspect-square w-full bg-gradient-to-br from-purple-500 to-pink-500">
				{coin.mediaContent?.previewImage?.medium ? (
					<Image
						src={coin.mediaContent.previewImage.medium}
						alt={coin.name}
						fill
						className="object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Play className="size-12 text-white opacity-50" />
					</div>
				)}
				{/* Play Icon Overlay */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onPlay?.(coin);
					}}
					className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
					aria-label="Play preview"
				>
					<Play className="size-10 text-white drop-shadow-lg" />
				</button>
				{/* Symbol Badge */}
				<div className="absolute top-2 right-2">
					<span className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-black shadow">
						{coin.symbol}
					</span>
				</div>
			</div>

			{/* Info Section */}
			<div className="p-4 space-y-2">
				<div className="flex items-center gap-2">
					<span className="font-bold text-base line-clamp-1">{coin.name}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					{coin.creatorProfile?.avatar?.previewImage?.medium && (
						<Image
							src={coin.creatorProfile.avatar.previewImage.medium}
							alt={coin.creatorProfile.handle || "creator avatar"}
							width={20}
							height={20}
							className="rounded-full"
						/>
					)}
					<span>@{coin.creatorProfile?.handle || "Unknown"}</span>
				</div>
				<div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
					<div className="flex items-center gap-1">
						<Users className="size-4" />
						<span>{coin.uniqueHolders}</span>
					</div>
					<div className="flex items-center gap-1">
						<MessageCircle className="size-4" />
						<span>{coin.zoraComments?.count ?? 0}</span>
					</div>
					<div className="flex items-center gap-1">
						<Heart className="size-4" />
						<span>{likeCount}</span>
					</div>
				</div>
				<div className="flex items-center gap-2 mt-3">
					<BuyCoinButton coinAddress={coin.address} amount="0.01" />
					<LikeButton
						coinAddress={coin.address}
						showCount={false}
						className="flex-1 justify-start"
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
								// Optionally show a toast
							}
						}}
						className="rounded-full p-2 hover:bg-accent transition"
						aria-label="Share"
					>
						<Share2 className="size-4" />
					</button>
				</div>
			</div>
		</button>
	);
}
