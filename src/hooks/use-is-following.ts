import { useAccount } from "wagmi";
import { useApiQuery } from "./use-api-query";

interface FollowingResponse {
  data: string[];
}

export function useIsFollowing(followeeAddress: string) {
  const { address: followerAddress } = useAccount();

  return useApiQuery(
    ["isFollowing", followerAddress, followeeAddress],
    `/api/user/${followeeAddress}/follow`,
    {
      enabled: !!followerAddress && !!followeeAddress,
      select: (data: FollowingResponse) =>
        data.data.includes(followerAddress || ""),
    }
  );
}
