import { useQuery } from "@tanstack/react-query";
import { getProfileCoins } from "@zoralabs/coins-sdk";

export function useProfileCoins(identifier: string, count: number = 20) {
	return useQuery({
		queryKey: ["profile-coins", identifier, count],
		queryFn: async () => {
			const response = await getProfileCoins({
				identifier,
				count,
			});
			return (
				response?.data?.profile?.createdCoins?.edges?.map(
					(edge) => edge.node,
				) || []
			);
		},
		enabled: Boolean(identifier),
	});
}
