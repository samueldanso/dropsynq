import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZoraProfile } from "@/types/profile";
import { Collections } from "./collections";
import { FollowingList } from "./following-list";
import { TrackList } from "./track-list";

interface ProfileTabsProps {
	profile: ZoraProfile;
}

export function ProfileTabs({ profile }: ProfileTabsProps) {
	if (!profile.address) return null;

	return (
		<Tabs defaultValue="tracks" className="w-full">
			<TabsList>
				<TabsTrigger value="tracks">Drops</TabsTrigger>
				<TabsTrigger value="collections">Collections</TabsTrigger>
				<TabsTrigger value="following">Following</TabsTrigger>
			</TabsList>
			<TabsContent value="tracks">
				<TrackList address={profile.address} />
			</TabsContent>
			<TabsContent value="collections">
				<Collections address={profile.address} />
			</TabsContent>
			<TabsContent value="following">
				<FollowingList address={profile.address} />
			</TabsContent>
		</Tabs>
	);
}
