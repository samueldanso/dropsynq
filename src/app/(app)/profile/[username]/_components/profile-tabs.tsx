"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collections } from "./collections";
import { TrackList } from "./track-list";

interface ProfileTabsProps {
	username: string;
}

export function ProfileTabs({ username }: ProfileTabsProps) {
	return (
		<Tabs defaultValue="tracks" className="w-full">
			<TabsList className="mx-auto flex w-fit">
				<TabsTrigger value="tracks">Creations</TabsTrigger>
				<TabsTrigger value="collections">Collection</TabsTrigger>
			</TabsList>
			<TabsContent value="tracks" className="mt-4">
				<TrackList username={username} />
			</TabsContent>
			<TabsContent value="collections" className="mt-4">
				<Collections username={username} />
			</TabsContent>
		</Tabs>
	);
}
