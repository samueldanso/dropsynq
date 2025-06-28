"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ZoraCoin, ZoraProfile } from "@/types/zora";
import { Collections } from "./collections";
import { TrackList } from "./track-list";

type CoinBalanceNode = NonNullable<
	GetProfileBalancesResponse["profile"]
>["coinBalances"]["edges"][0]["node"];

interface ProfileTabsProps {
	handle: string;
	profile: ZoraProfile;
	balances?: CoinBalanceNode[];
	coins?: ZoraCoin[];
}

export function ProfileTabs({ handle, balances, coins }: ProfileTabsProps) {
	return (
		<Tabs defaultValue="tracks" className="w-full">
			<TabsList className="mx-auto flex w-fit">
				<TabsTrigger value="drops">Drops</TabsTrigger>
				<TabsTrigger value="collection">Collections</TabsTrigger>
			</TabsList>
			<TabsContent value="drops" className="mt-4">
				<TrackList coins={coins} />
			</TabsContent>
			<TabsContent value="collection" className="mt-4">
				<Collections balances={balances} />
			</TabsContent>
		</Tabs>
	);
}
