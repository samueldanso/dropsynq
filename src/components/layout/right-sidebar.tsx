"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCoinsTopGainers, getProfile } from "@zoralabs/coins-sdk";
import { Skeleton } from "@/components/ui/skeleton";

interface ZoraProfile {
  handle: string;
  avatar?: { medium: string };
  displayName?: string;
  publicWallet: { walletAddress: string };
}

function MiniArtistCard({ profile }: { profile: ZoraProfile }) {
  const name =
    profile.displayName ||
    profile.handle ||
    profile.publicWallet.walletAddress.slice(0, 8) + "...";
  const href = profile.handle
    ? `/profile/${profile.handle}`
    : `/profile/${profile.publicWallet.walletAddress}`;
  return (
    <Link
      href={href}
      className="flex items-center gap-3 group focus:outline-none"
      tabIndex={0}
      aria-label={`View profile for ${name}`}
    >
      {profile.avatar?.medium ? (
        <img
          src={profile.avatar.medium}
          alt={name}
          className="size-10 rounded-full object-cover border border-muted group-hover:scale-105 group-focus:scale-105 transition"
        />
      ) : (
        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-base font-bold text-muted-foreground group-hover:scale-105 group-focus:scale-105 transition">
          {name[0]}
        </div>
      )}
      <span className="text-sm font-medium truncate max-w-[100px]">{name}</span>
    </Link>
  );
}

export function RightSidebar() {
  const [artists, setArtists] = useState<ZoraProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      setIsLoading(true);
      setError(null);
      try {
        const coinsRes = await getCoinsTopGainers({ count: 10 });
        const coins =
          coinsRes?.data?.exploreList?.edges?.map((edge: any) => edge.node) ||
          [];
        const uniqueAddresses = Array.from(
          new Set(coins.map((coin: any) => coin.creatorAddress).filter(Boolean))
        );
        const profiles: ZoraProfile[] = [];
        for (const address of uniqueAddresses) {
          try {
            const res = await getProfile({ identifier: address });
            const profile = res?.data?.profile;
            if (
              profile &&
              profile.handle &&
              profile.publicWallet?.walletAddress
            ) {
              profiles.push({
                handle: profile.handle,
                avatar: profile.avatar
                  ? { medium: profile.avatar.medium }
                  : undefined,
                displayName: profile.displayName,
                publicWallet: {
                  walletAddress: profile.publicWallet.walletAddress,
                },
              });
            }
          } catch (e) {}
        }
        setArtists(profiles.slice(0, 5));
      } catch (err: any) {
        setError(err?.message || "Failed to load artists");
      } finally {
        setIsLoading(false);
      }
    }
    fetchArtists();
  }, []);

  return (
    <aside className="hidden lg:block w-72 my-4 mr-4 flex-shrink-0">
      <div className="bg-card rounded-2xl shadow-lg border p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold mb-2">Featured Artists</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Discover trending creators
          </p>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {artists.map((profile) => (
              <MiniArtistCard
                key={profile.handle || profile.publicWallet.walletAddress}
                profile={profile}
              />
            ))}
          </div>
        )}
        <div className="pt-2">
          <Link
            href="/artists"
            className="block text-center text-primary font-medium text-sm mt-2 hover:underline"
          >
            Discover more →
          </Link>
        </div>
      </div>
    </aside>
  );
}
