"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import {
  getProfile,
  getProfileBalances,
  getProfileCoins,
} from "@zoralabs/coins-sdk";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Loader } from "@/components/ui/loader";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileTabs } from "./_components/profile-tabs";

export default function ProfilePage() {
  const { address } = useAccount();
  const params = useParams();
  const handle = params?.handle as string | undefined;
  const identifier = handle || address || "";

  const profile = useQuery({
    queryKey: ["profile", identifier],
    queryFn: async () => {
      const res = await getProfile({ identifier });
      return res?.data?.profile;
    },
    enabled: !!identifier,
  });

  const balances = useQuery({
    queryKey: ["profile-balances", identifier],
    queryFn: async () => {
      const res = await getProfileBalances({ identifier });
      return (
        res?.data?.profile?.coinBalances?.edges?.map(
          (
            edge: NonNullable<
              GetProfileBalancesResponse["profile"]
            >["coinBalances"]["edges"][0]
          ) => edge.node
        ) || []
      );
    },
    enabled: !!identifier,
  });

  const coins = useQuery({
    queryKey: ["profile-coins", identifier],
    queryFn: async () => {
      const res = await getProfileCoins({ identifier });
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.log("getProfileCoins raw response", res);
      }
      const profile = res?.data?.profile as any;
      return (
        (profile as any)?.createdCoins?.edges?.map((edge: any) => edge.node) ||
        []
      );
    },
    enabled: !!identifier,
  });

  const isLoading = profile.isLoading || balances.isLoading || coins.isLoading;
  const isError = profile.isError || balances.isError || coins.isError;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !profile.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-muted/80 shadow-lg p-8 mt-6 mb-6">
      <ProfileHeader profile={profile.data} balances={balances.data} />
      <div className="mt-8">
        <ProfileTabs
          profile={profile.data}
          balances={balances.data}
          coins={coins.data}
        />
      </div>
    </div>
  );
}
