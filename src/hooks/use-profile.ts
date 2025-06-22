import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@zoralabs/coins-sdk";
import { ZoraProfile } from "@/types/profile";

export function useProfile(identifier: string) {
	return useQuery<ZoraProfile | undefined>({
		queryKey: ["profile", identifier],
		queryFn: async () => {
			const response = await getProfile({ identifier });
			return response?.data?.profile as ZoraProfile | undefined;
		},
		enabled: Boolean(identifier),
	});
}
