"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useFollowSocial } from "@/hooks/use-social";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
	userId: string;
	className?: string;
	showText?: boolean;
}

export function FollowButton({
	userId,
	className,
	showText = true,
}: FollowButtonProps) {
	const { address } = useAccount();
	const { isFollowing, toggleFollow, isFollowLoading } = useFollowSocial({
		followeeAddress: userId,
	});

	const handleFollow = () => {
		if (!address) {
			// Could show a toast here asking user to connect wallet
			return;
		}
		toggleFollow();
	};

	return (
		<Button
			onClick={handleFollow}
			disabled={isFollowLoading || !address}
			variant={isFollowing ? "outline" : "default"}
			size="sm"
			className={cn(
				"rounded-full transition-all",
				isFollowing && "hover:bg-destructive hover:text-destructive-foreground",
				className,
			)}
		>
			{isFollowLoading
				? "..."
				: isFollowing
					? showText
						? "Unfollow"
						: "✓"
					: showText
						? "Follow"
						: "+"}
		</Button>
	);
}
