"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@zoralabs/coins-sdk";
import { Bell, Copy, LogOut, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

// Upload Button Component
function UploadButton() {
  const { authenticated } = usePrivy();
  const buttonStyle = authenticated
    ? { backgroundColor: "#FF9900", color: "#111" }
    : {
        backgroundColor: "#FFF3E0",
        color: "#B26B00",
        opacity: 0.7,
        filter: "grayscale(0.2)",
      };
  return (
    <Link href="/create">
      <Button
        variant="ghost"
        size="default"
        className="flex items-center gap-2 h-10 px-4 text-sm rounded-full font-semibold shadow-none border-none"
        style={buttonStyle}
      >
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">New song</span>
      </Button>
    </Link>
  );
}

// Notifications Button Component
function NotificationsButton() {
  const { authenticated } = usePrivy();

  if (!authenticated) {
    return null;
  }

  const handleNotificationClick = () => {
    // TODO: Implement notifications feature
    alert(
      "🔔 Notifications coming soon!\n\nYou'll get notified about:\n• New coin launches\n• Price changes\n• Comments & likes\n• Followers"
    );
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleNotificationClick}
      className="relative"
    >
      <Bell className="h-5 w-5" />

      {/* <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
        3
      </span> */}
    </Button>
  );
}

// Profile Dropdown
function ProfileDropdown() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const router = useRouter();

  // Fetch Zora profile for handle (if authenticated)
  const { data: zoraProfile } = useQuery({
    queryKey: ["zora-profile", user?.wallet?.address],
    queryFn: async () => {
      if (!user?.wallet?.address) return null;
      const res = await getProfile({ identifier: user.wallet.address });
      return res?.data?.profile;
    },
    enabled: !!user?.wallet?.address,
  });

  // Copy-to-clipboard utility
  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    if (typeof window !== "undefined") {
      import("sonner").then(({ toast }) => toast.success("Copied!"));
    }
  }

  // Compute full profile link for sharing
  const profileLink =
    typeof window !== "undefined"
      ? `${window.location.origin}${
          zoraProfile?.handle
            ? `/profile/${zoraProfile.handle}`
            : user?.wallet?.address
            ? `/profile/${user.wallet.address}`
            : ""
        }`
      : zoraProfile?.handle
      ? `/profile/${zoraProfile.handle}`
      : user?.wallet?.address
      ? `/profile/${user.wallet.address}`
      : "";

  if (!authenticated || !user) {
    return (
      <Button
        onClick={login}
        className="h-10 px-4 text-sm rounded-full font-semibold shadow-none border-none"
        style={{ backgroundColor: "#FF9900", color: "#111" }}
        variant="ghost"
      >
        Sign in
      </Button>
    );
  }

  const handle = zoraProfile?.handle;
  const address = user.wallet?.address;

  const handleDisplay = handle ? `@${handle}` : undefined;
  const addressDisplay = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleToCopy = handle || undefined;
  const addressToCopy = address || "";

  const handleProfileClick = () => {
    if (user.wallet) {
      if (handle) {
        router.push(`/profile/${handle}`);
      } else {
        router.push(`/profile/${user.wallet.address}`);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={handleProfileClick}
          className="flex shrink-0 items-center rounded-full p-1 transition-all hover:scale-105 hover:bg-muted/50"
          type="button"
        >
          {zoraProfile?.avatar?.medium ? (
            <Image
              src={zoraProfile.avatar.medium}
              alt={handleDisplay || addressDisplay || "User avatar"}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-transparent hover:ring-ring/20"
              priority
            />
          ) : (
            <div className="h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center ring-2 ring-transparent hover:ring-ring/20">
              <span className="text-sm font-medium">
                {user.wallet?.address?.substring(2, 4).toUpperCase()}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <div className="px-3 py-2 flex flex-col gap-1">
          {handleDisplay && (
            <div className="flex items-center gap-1 text-xs text-foreground font-medium">
              <span>{handleDisplay}</span>
              <button
                type="button"
                className="p-1 hover:bg-muted/60 rounded"
                onClick={() => handleCopy(profileLink)}
                title="Copy profile link"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
          {addressDisplay && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{addressDisplay}</span>
              <button
                type="button"
                className="p-1 hover:bg-muted/60 rounded"
                onClick={() => handleCopy(addressToCopy)}
                title="Copy address"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppHeader() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <header className="flex h-16 w-full items-center justify-between bg-background px-6">
        {/* Right: Upload, Notifications, Profile */}
        <div className="flex items-center gap-3 ml-auto">
          <UploadButton />
          <NotificationsButton />
          <ProfileDropdown />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Open menu">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <AppSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-16 w-full items-center bg-card rounded-2xl shadow-lg border px-8 mt-4 mx-4">
      {/* Center: Search Bar */}
      <div className="mx-auto max-w-md flex-1">
        <SearchBar />
      </div>
      {/* Right: Upload, Notifications & Profile Avatar */}
      <div className="flex items-center gap-5 ml-8">
        <UploadButton />
        <NotificationsButton />
        <ProfileDropdown />
      </div>
    </header>
  );
}
