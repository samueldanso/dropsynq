"use client";

import { DollarSign, Pause, Play, Share2, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ZoraCoin } from "@/types/zora";
import BuyCoinButton from "./buy-coin-button";
import { LikeButton } from "./like-button";

interface TrackCardProps {
	coin: ZoraCoin;
	onPlay?: (coin: ZoraCoin, isPlaying: boolean) => void;
	isPlaying?: boolean;
}

export function TrackCard({ coin, onPlay, isPlaying = false }: TrackCardProps) {
	const router = useRouter();
	const { ready, authenticated, login } =
		require("@privy-io/react-auth").usePrivy();

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

	function handleCardClick() {
		router.push(`/track/${coin.address}`);
	}

	return (
		<button
			type="button"
			className="track-card-root group relative w-[220px] h-[300px] cursor-pointer rounded-xl bg-transparent transition-all duration-300 overflow-hidden flex flex-col shadow-none border-none text-left"
			onClick={handleCardClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleCardClick();
				}
			}}
		>
			<Card className="w-full h-full bg-transparent shadow-none border-none p-0 flex flex-col">
				{/* Header: Cover + Play */}
				<div className="relative w-full aspect-[3/4] max-w-[180px] mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
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
							<Play className="size-14 text-white/30" />
						</div>
					)}
					{/* Play Overlay - always centered, only visible on hover/focus */}
					<div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="h-16 w-16 rounded-full bg-[#FF9900] text-black opacity-0 transition-all hover:scale-110 hover:bg-[#e88a00] group-hover:opacity-100 focus:opacity-100 z-30 flex items-center justify-center"
							onClick={(e) => {
								e.stopPropagation();
								onPlay?.(coin, isPlaying);
							}}
							aria-label={isPlaying ? "Pause preview" : "Play preview"}
						>
							{isPlaying ? (
								<Pause
									className="size-7 text-black fill-current"
									fill="currentColor"
								/>
							) : (
								<Play
									className="size-7 text-black fill-current ml-1"
									fill="currentColor"
								/>
							)}
						</Button>
					</div>
					{/* Symbol Badge */}
					<div className="absolute top-2 right-2">
						<span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
							{coin.symbol}
						</span>
					</div>
				</div>
				{/* Content */}
				<div className="flex-1 px-3 py-2 flex flex-col gap-2 justify-between bg-transparent rounded-b-xl">
					{/* Title */}
					<h3 className="font-bold text-base text-foreground line-clamp-1 text-left group-hover:text-primary transition-colors">
						{coin.name}
					</h3>
					{/* Artist */}
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						{coin.creatorProfile?.avatar?.previewImage?.medium && (
							<Image
								src={coin.creatorProfile.avatar.previewImage.medium}
								alt={coin.creatorProfile.handle || "creator avatar"}
								width={18}
								height={18}
								className="rounded-full"
							/>
						)}
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none text-sm"
							onClick={(e) => {
								e.stopPropagation();
								handleArtistClick(e);
							}}
							tabIndex={0}
							aria-label="View artist profile"
						>
							{coin.creatorProfile?.handle || "Unknown Artist"}
						</Button>
					</div>
					{/* Stats Row */}
					<div className="flex items-center gap-4 text-sm mt-1">
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
						<Button
							type="button"
							variant="ghost"
							size="icon"
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
						</Button>
					</div>
					{/* Buy Button */}
					<div className="mt-2">
						<Button
							type="button"
							className="w-full py-2 rounded-xl bg-[#FF9900] text-black font-semibold text-sm hover:bg-[#e88a00] transition z-30 pointer-events-auto"
							onClick={(e) => {
								e.stopPropagation();
								router.push(`/track/${coin.address}`);
							}}
						>
							Buy
						</Button>
					</div>
				</div>
			</Card>
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
