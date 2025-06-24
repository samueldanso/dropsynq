"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Loader } from "@/components/ui/loader";
import { useProfile } from "@/hooks/use-profile";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileTabs } from "./_components/profile-tabs";

interface ProfilePageProps {
	params: {
		username: string;
	};
}

export default function ProfilePage({ params }: ProfilePageProps) {
	const { address } = useAccount();
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
			<ProfileHeader username={params.username} />
			<div className="mt-8">
				<ProfileTabs username={params.username} />
			</div>
		</div>
	);
}
