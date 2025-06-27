// This component will be used to display a single track in a feed or list.

import { Play, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ZoraCoin } from "@/types/coin";

interface TrackCardProps {
	coin: ZoraCoin;
}

export function TrackCard({ coin }: TrackCardProps) {
	return (
		<Card className="overflow-hidden transition-shadow hover:shadow-lg">
			<div className="relative aspect-square bg-gradient-to-br from-purple-500 to-pink-500">
				{coin.mediaContent?.previewImage?.medium ? (
					<img
						src={coin.mediaContent.previewImage.medium}
						alt={coin.name}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Play className="size-12 text-white opacity-50" />
					</div>
				)}
				<div className="absolute inset-0 bg-black/20" />
				<div className="absolute top-2 right-2">
					<Badge variant="secondary" className="bg-white/90 text-black">
						{coin.symbol}
					</Badge>
				</div>
			</div>

			<CardHeader className="p-4">
				<CardTitle className="line-clamp-1 text-lg">{coin.name}</CardTitle>
				<CardDescription className="line-clamp-2">
					{coin.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="p-4 pt-0">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-4 text-muted-foreground text-sm">
						<div className="flex items-center gap-1">
							<Users className="size-4" />
							<span>{coin.uniqueHolders}</span>
						</div>
						<div className="flex items-center gap-1">
							<TrendingUp className="size-4" />
							<span>${parseFloat(coin.volume24h).toFixed(2)}</span>
						</div>
					</div>
				</div>

				<div className="mb-4 flex items-center gap-2">
					{coin.creatorProfile?.avatar?.previewImage?.medium && (
						<img
							src={coin.creatorProfile.avatar.previewImage.medium}
							alt={coin.creatorProfile.handle}
							className="size-6 rounded-full"
						/>
					)}
					<span className="text-muted-foreground text-sm">
						@{coin.creatorProfile?.handle || "Unknown"}
					</span>
				</div>

				<Link href={`/track/${coin.address}`}>
					<Button className="w-full" size="sm">
						View Track
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}

export function TrackCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<Skeleton className="aspect-square w-full" />
			<CardHeader className="p-4">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="mt-2 h-4 w-full" />
				<Skeleton className="mt-1 h-4 w-1/2" />
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Skeleton className="h-5 w-10" />
						<Skeleton className="h-5 w-10" />
					</div>
				</div>
				<div className="mb-4 flex items-center gap-2">
					<Skeleton className="size-6 rounded-full" />
					<Skeleton className="h-4 w-1/3" />
				</div>
				<Skeleton className="h-9 w-full" />
			</CardContent>
		</Card>
	);
}
