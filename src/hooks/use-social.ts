import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount } from "wagmi";

// Song-related social actions
interface UseSongSocialProps {
	coinAddress: string;
	userAddress?: string;
}

export function useSongSocial({
	coinAddress,
	userAddress,
}: UseSongSocialProps) {
	const queryClient = useQueryClient();

	// Check if user has liked this song
	const { data: isLiked, isLoading: isLikeLoading } = useQuery({
		queryKey: ["song-like", coinAddress, userAddress],
		queryFn: async () => {
			if (!userAddress) return false;
			const response = await fetch(
				`/api/songs/${coinAddress}/like?user=${userAddress}`,
			);
			if (!response.ok) return false;
			const data = await response.json();
			return data.data?.isLiked || false;
		},
		enabled: !!coinAddress && !!userAddress,
	});

	// Get song comments
	const { data: comments, isLoading: isCommentsLoading } = useQuery({
		queryKey: ["song-comments", coinAddress],
		queryFn: async () => {
			const response = await fetch(`/api/songs/${coinAddress}/comment`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch comments");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!coinAddress,
	});

	// Like song mutation
	const likeMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/songs/${coinAddress}/like`, {
				method: "POST",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to like song");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Song liked!");
			queryClient.invalidateQueries({
				queryKey: ["song-like", coinAddress, userAddress],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to like song");
		},
	});

	// Unlike song mutation
	const unlikeMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/songs/${coinAddress}/like`, {
				method: "DELETE",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to unlike song");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Song unliked!");
			queryClient.invalidateQueries({
				queryKey: ["song-like", coinAddress, userAddress],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to unlike song");
		},
	});

	// Add comment mutation
	const addCommentMutation = useMutation({
		mutationFn: async (commentText: string) => {
			const response = await fetch(`/api/songs/${coinAddress}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ comment_text: commentText }),
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to add comment");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Comment added!");
			queryClient.invalidateQueries({
				queryKey: ["song-comments", coinAddress],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to add comment");
		},
	});

	const toggleLike = () => {
		if (isLiked) {
			unlikeMutation.mutate();
		} else {
			likeMutation.mutate();
		}
	};

	return {
		// Like data
		isLiked: isLiked || false,
		isLikeLoading,
		toggleLike,
		like: likeMutation.mutate,
		unlike: unlikeMutation.mutate,
		isLikeMutationLoading: likeMutation.isPending,
		isUnlikeMutationLoading: unlikeMutation.isPending,

		// Comments data
		comments: comments || [],
		isCommentsLoading,
		addComment: addCommentMutation.mutate,
		isAddingComment: addCommentMutation.isPending,
	};
}

// User profile social data
interface UseUserSocialProps {
	handle: string;
	limit?: number;
	offset?: number;
}

export function useUserSocial({
	handle,
	limit = 20,
	offset = 0,
}: UseUserSocialProps) {
	// Get user's liked songs
	const { data: likes, isLoading: isLikesLoading } = useQuery({
		queryKey: ["user-likes", handle, limit, offset],
		queryFn: async () => {
			const response = await fetch(
				`/api/profile/${handle}/likes?limit=${limit}&offset=${offset}`,
			);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch user likes");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!handle,
	});

	// Get user's comments
	const { data: comments, isLoading: isCommentsLoading } = useQuery({
		queryKey: ["user-comments", handle, limit, offset],
		queryFn: async () => {
			const response = await fetch(
				`/api/profile/${handle}/comments?limit=${limit}&offset=${offset}`,
			);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch user comments");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!handle,
	});

	return {
		// User's liked songs
		likes: likes || [],
		isLikesLoading,

		// User's comments
		comments: comments || [],
		isCommentsLoading,
	};
}

// Follow-related social actions
interface UseFollowSocialProps {
	followeeAddress: string;
}

export function useFollowSocial({ followeeAddress }: UseFollowSocialProps) {
	const queryClient = useQueryClient();
	const { address: followerAddress } = useAccount();

	// Check if user is following this person
	const { data: isFollowing, isLoading: isFollowingLoading } = useQuery({
		queryKey: ["isFollowing", followerAddress, followeeAddress],
		queryFn: async () => {
			if (!followerAddress || !followeeAddress) return false;
			const response = await fetch(`/api/profile/${followeeAddress}/follow`);
			if (!response.ok) return false;
			const data = await response.json();
			return data.data?.includes(followerAddress) || false;
		},
		enabled: !!followerAddress && !!followeeAddress,
	});

	// Get list of who this user is following
	const { data: following, isLoading: isFollowingListLoading } = useQuery({
		queryKey: ["following", followeeAddress],
		queryFn: async () => {
			const response = await fetch(`/api/profile/${followeeAddress}/follow`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch following list");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!followeeAddress,
	});

	// Follow/unfollow mutation
	const followMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/profile/${followeeAddress}/follow`, {
				method: "POST",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to follow/unfollow");
			}
			return response.json();
		},
		onSuccess: (data) => {
			toast.success(
				data.data.status === "followed"
					? "Successfully followed"
					: "Successfully unfollowed",
			);
			// Invalidate related queries
			queryClient.invalidateQueries({
				queryKey: ["isFollowing", followerAddress, followeeAddress],
			});
			queryClient.invalidateQueries({
				queryKey: ["following", followeeAddress],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to follow/unfollow");
		},
	});

	const toggleFollow = () => {
		followMutation.mutate();
	};

	return {
		// Follow data
		isFollowing: isFollowing || false,
		isFollowingLoading,
		toggleFollow,
		follow: followMutation.mutate,
		isFollowLoading: followMutation.isPending,

		// Following list data
		following: following || [],
		isFollowingListLoading,
	};
}
