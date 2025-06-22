import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiMutation } from "./use-api-mutation";

export function useFollow(followeeAddress: string) {
	const queryClient = useQueryClient();

	return useApiMutation({
		endpoint: `/api/user/${followeeAddress}/follow`,
		method: "POST",
		options: {
			onSuccess: (data: any) => {
				toast.success(
					data.data.status === "followed" ? "Successfully followed" : "Successfully unfollowed",
				);
				queryClient.invalidateQueries({
					queryKey: ["isFollowing", undefined, followeeAddress],
				});
				queryClient.invalidateQueries({ queryKey: ["following", undefined] });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		},
	});
}
