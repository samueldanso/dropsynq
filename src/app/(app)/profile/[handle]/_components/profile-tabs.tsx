"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MusicPlayer from "@/components/shared/music-player";
import type { ZoraCoin, ZoraProfile } from "@/types/zora";
import { Collections } from "./collections";
import { TrackList } from "./track-list";
import { UpcomingDrops } from "./upcoming-drops";

type CoinBalanceNode = NonNullable<
	GetProfileBalancesResponse["profile"]
>["coinBalances"]["edges"][0]["node"];

interface ProfileTabsProps {
	profile: ZoraProfile;
	balances?: CoinBalanceNode[];
	coins?: ZoraCoin[];
}

export function ProfileTabs({ balances, coins }: ProfileTabsProps) {
	const searchParams = useSearchParams();
	const initialTab = searchParams.get("tab") || "drops";
	const [activeTab, setActiveTab] = useState<string>(initialTab);

	const [playerTrack, setPlayerTrack] = useState<any | null>(null);
	const [isPlayerOpen, setIsPlayerOpen] = useState(false);

	function handlePlay(coin: any) {
		setPlayerTrack({
			title: coin.name,
			artist: coin.creatorProfile?.handle || "Unknown",
			audioUrl: coin.mediaContent?.originalUri || "",
			coverUrl: coin.mediaContent?.previewImage?.medium || undefined,
		});
		setIsPlayerOpen(true);
	}

	const tabs = [
		{ id: "drops", label: "Drops" },
		{ id: "collection", label: "Collections" },
		{ id: "upcoming", label: "Upcoming" },
		{ id: "favorites", label: "Favorites" },
	];

	return (
		<>
			<div className="flex w-full flex-col gap-4">
				{/* Tab Headers */}
				<div className="flex items-center gap-2 justify-center">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type="button"
							className={`rounded-full px-4 py-2 font-medium text-sm transition-all ${
								activeTab === tab.id
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
							}`}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === "drops" && (
					<TrackList
						coins={coins}
						onPlay={handlePlay}
						playerTrack={playerTrack}
						isPlayerOpen={isPlayerOpen}
					/>
				)}
				{activeTab === "favorites" && (
					<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
						<p>Favorites coming soon.</p>
					</div>
				)}
				{activeTab === "collection" && (
					<Collections
						balances={balances}
						playerTrack={playerTrack}
						isPlayerOpen={isPlayerOpen}
						onPlay={handlePlay}
					/>
				)}
				{activeTab === "upcoming" && <UpcomingDrops />}
			</div>
			<MusicPlayer
				track={playerTrack}
				isOpen={isPlayerOpen && !!playerTrack}
				onClose={() => setIsPlayerOpen(false)}
			/>
		</>
	);
}
