"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
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
	const [activeTab, setActiveTab] = useState<string>("drops");
	const tabs = [
		{ id: "drops", label: "Drops" },
		{ id: "collection", label: "Collections" },
		{ id: "upcoming", label: "Upcoming" },
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
			{activeTab === "collection" && <Collections balances={balances} />}
			{activeTab === "upcoming" && <UpcomingDrops />}
		</div>
	);
}
