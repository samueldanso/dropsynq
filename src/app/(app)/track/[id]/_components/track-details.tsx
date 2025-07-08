"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoin } from "@zoralabs/coins-sdk";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BuyCoinButton from "@/components/shared/buy-button";
import { LikeButton } from "@/components/shared/like-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLikeCount } from "@/hooks/use-social";
import { TradeCard } from "./trade-card";

interface TrackDetailsProps {
	id: string;
}

export default function TrackDetails({ id }: TrackDetailsProps) {
	const { likeCount } = useLikeCount({ coinAddress: id });
	const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);
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

	useEffect(() => {
		if (!isPreviewPlaying && audioRef.current) {
			audioRef.current.pause();
		}
	}, [isPreviewPlaying]);

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
		"https://ipfs.io/ipfs/",
	);
	const artist = anyCoin.properties?.creator || coin.creatorAddress;

	function handlePreviewPlay(e: React.MouseEvent) {
		e.stopPropagation();
		if (audioRef.current) {
			if (isPreviewPlaying) {
				audioRef.current.pause();
				setIsPreviewPlaying(false);
			} else {
				audioRef.current.currentTime = 0;
				audioRef.current.play();
				setIsPreviewPlaying(true);
			}
		}
	}

	return (
		<div className="max-w-5xl mx-auto py-10 px-4">
			<div className="flex flex-col md:flex-row gap-10 items-start">
				{/* Left: Cover, Play, Title, Artist */}
				<div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
					<div className="relative w-72 h-72 mb-6 group">
						{image ? (
							<Image
								src={image}
								alt={coin.name ? `${coin.name} cover` : "Track cover"}
								width={320}
								height={320}
								className="rounded-xl object-cover w-72 h-72"
							/>
						) : (
							<div className="w-72 h-72 rounded-xl bg-muted flex items-center justify-center text-6xl text-muted-foreground">
								🎵
							</div>
						)}
						{/* Play overlay */}
						{audio && (
							<button
								type="button"
								className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 group-focus:bg-black/40 transition-all rounded-xl"
								onClick={handlePreviewPlay}
								aria-label={isPreviewPlaying ? "Pause preview" : "Play preview"}
								tabIndex={0}
							>
								<span
									className={`opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all bg-[#FF9900] text-black rounded-full p-4 shadow-lg flex items-center justify-center ${
										isPreviewPlaying ? "scale-110" : ""
									}`}
								>
									{isPreviewPlaying ? (
										<svg
											className="w-8 h-8"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<title>Pause preview</title>
											<rect x="6" y="4" width="4" height="16" rx="1" />
											<rect x="14" y="4" width="4" height="16" rx="1" />
										</svg>
									) : (
										<svg
											className="w-8 h-8 ml-1"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<title>Play preview</title>
											<polygon points="5,3 19,12 5,21 5,3" />
										</svg>
									)}
								</span>
							</button>
						)}
						{/* Hidden audio for preview */}
						{audio && (
							<audio
								ref={audioRef}
								src={audio}
								onEnded={() => setIsPreviewPlaying(false)}
								className="hidden"
							>
								<track kind="captions" label="Preview captions" />
							</audio>
						)}
					</div>
					<h1 className="text-3xl font-bold mb-2 text-center md:text-left w-full">
						{coin.name}
					</h1>
					<div className="text-lg text-muted-foreground mb-4 text-center md:text-left w-full">
						by {artist}
					</div>
				</div>
				{/* Right: All current info */}
				<div className="w-full md:w-1/2 flex flex-col gap-6">
					<div className="text-base mb-2">{coin.description}</div>
					{audio && (
						<audio controls src={audio} className="w-full mb-2">
							<track kind="captions" label="Song captions" />
							Your browser does not support the audio element.
						</audio>
					)}
					<div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
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
					<div className="flex items-center gap-4">
						<BuyCoinButton coinAddress={id} />
						<LikeButton
							coinAddress={id}
							showCount={true}
							likeCount={likeCount}
							className="px-6"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
