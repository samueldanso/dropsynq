"use client";

import { Heart } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useSongSocial } from "@/hooks/use-social";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
	coinAddress: string;
	className?: string;
	showCount?: boolean;
	likeCount?: number;
}

export function LikeButton({
	coinAddress,
	className,
	showCount = false,
	likeCount = 0,
}: LikeButtonProps) {
	const { address } = useAccount();
	const { isLiked, toggleLike, isLikeLoading } = useSongSocial({
		coinAddress,
		userAddress: address,
	});

	const handleLike = () => {
		if (!address) {
			// Could show a toast here asking user to connect wallet
			return;
		}
		toggleLike();
	};

	return (
		<Button
			onClick={handleLike}
			disabled={isLikeLoading || !address}
			variant="ghost"
			size="sm"
			className={cn(
				"gap-2 hover:bg-accent/50 transition-colors",
				isLiked && "text-red-500 hover:text-red-600",
				className,
			)}
		>
			<Heart
				className={cn("size-4 transition-colors", isLiked && "fill-current")}
			/>
			{showCount && <span className="text-sm font-medium">{likeCount}</span>}
		</Button>
	);
}
