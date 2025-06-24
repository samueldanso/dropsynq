import { useQuery } from "@tanstack/react-query";
import { getCoinsNew } from "@zoralabs/coins-sdk";

export function useCoinsNew(count: number = 20) {
	return useQuery({
		queryKey: ["coins-new", count],
		queryFn: async () => {
			const response = await getCoinsNew({ count });
			return response?.data?.exploreList?.edges?.map((edge) => edge.node) || [];
		},
	});
}
