"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Loader } from "@/components/ui/loader";
import { useProfile } from "@/hooks/use-profile";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileTabs } from "./_components/profile-tabs";

export default function ProfilePage() {
	const { address } = useAccount();
	const params = useParams();
	const username = params?.username as string | undefined;
	const identifier = username || address || "";
	const { data: profile, isLoading } = useProfile(identifier);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Profile not found.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<ProfileHeader username={username} />
			<div className="mt-8">
				<ProfileTabs username={username} />
			</div>
		</div>
	);
}
