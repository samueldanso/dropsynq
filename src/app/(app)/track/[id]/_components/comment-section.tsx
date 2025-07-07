"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoinComments } from "@zoralabs/coins-sdk";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentSectionProps {
	coinAddress: string;
}

// Define the correct comment structure based on Zora API
interface ZoraCommentNode {
	txHash: string;
	comment: string;
	userAddress: string;
	timestamp: number;
	userProfile?: {
		id: string;
		handle: string;
		avatar?: {
			previewImage: {
				blurhash?: string;
				small: string;
				medium: string;
			};
		};
	};
	replies?: {
		count: number;
		edges: Array<{
			node: ZoraCommentNode;
		}>;
	};
}

export default function CommentSection({ coinAddress }: CommentSectionProps) {
	const {
		data: commentsData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["coin-comments", coinAddress],
		queryFn: async () => {
			const response = await getCoinComments({
				address: coinAddress as `0x${string}`,
				count: 50, // Fetch up to 50 comments
			});
			return response?.data?.zora20Token?.zoraComments;
		},
		enabled: !!coinAddress,
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 text-muted-foreground">
					<MessageCircle className="size-4" />
					<span className="text-sm font-medium">Comments</span>
				</div>
				<div className="space-y-4">
					{Array.from({ length: 3 }, (_, i) => (
						<div
							key={`comment-skeleton-${i}-${Math.random()
								.toString(36)
								.substring(2, 9)}`}
							className="flex gap-3"
						>
							<Skeleton className="size-8 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center text-muted-foreground py-8">
				<MessageCircle className="size-8 mx-auto mb-2 opacity-50" />
				<p>Failed to load comments</p>
			</div>
		);
	}

	const comments = commentsData?.edges || [];
	const commentCount = commentsData?.count || 0;

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 text-muted-foreground">
				<MessageCircle className="size-4" />
				<span className="text-sm font-medium">Comments ({commentCount})</span>
			</div>

			{comments.length === 0 ? (
				<div className="text-center text-muted-foreground py-8">
					<MessageCircle className="size-8 mx-auto mb-2 opacity-50" />
					<p>No comments yet. Be the first to comment!</p>
				</div>
			) : (
				<div className="space-y-4">
					{comments.map((edge) => {
						const comment = edge.node as ZoraCommentNode;
						const userProfile = comment.userProfile;
						const displayName =
							userProfile?.handle || comment.userAddress.slice(0, 8) + "...";
						const avatar = userProfile?.avatar?.previewImage?.small;

						return (
							<div key={comment.txHash} className="flex gap-3">
								<UserAvatar src={avatar} alt={displayName} size="sm" />
								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-foreground">
											{displayName}
										</span>
										<span className="text-xs text-muted-foreground">
											{formatDistanceToNow(new Date(comment.timestamp * 1000), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-sm text-foreground">{comment.comment}</p>

									{/* Show reply count if there are replies */}
									{comment.replies && comment.replies.count > 0 && (
										<div className="flex items-center gap-4 mt-2">
											<div className="flex items-center gap-1 text-xs text-muted-foreground">
												<span>{comment.replies.count} replies</span>
											</div>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
