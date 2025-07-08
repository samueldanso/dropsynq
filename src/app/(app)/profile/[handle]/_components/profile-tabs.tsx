"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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
	const tabs = [
		{ id: "drops", label: "Drops" },
		{ id: "collection", label: "Collections" },
		{ id: "upcoming", label: "Upcoming" },
		{ id: "favorites", label: "Favorites" },
	];

	return (
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
			{activeTab === "drops" && <TrackList coins={coins} />}
			{activeTab === "favorites" && (
				<div className="flex items-center justify-center p-8 text-center text-muted-foreground">
					<p>Favorites coming soon.</p>
				</div>
			)}
			{activeTab === "collection" && <Collections balances={balances} />}
			{activeTab === "upcoming" && <UpcomingDrops />}
		</div>
	);
}
