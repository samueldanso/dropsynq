"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Bell, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "./sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

// Upload Button Component
function UploadButton() {
  const { authenticated } = usePrivy();

  if (!authenticated) {
    return null;
  }

  return (
    <Link href="/create">
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2 bg-primary font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Upload</span>
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

  // For now, just show coming soon - no real functionality yet
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
      {/* Notification badge - hidden for now */}
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

  if (!authenticated || !user) {
    return (
      <Button
        onClick={login}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        variant="default"
      >
        Sign in
      </Button>
    );
  }

  const handleProfileClick = () => {
    if (user.wallet) {
      router.push(`/profile/${user.wallet.address}`);
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
          <div className="h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center ring-2 ring-transparent hover:ring-ring/20">
            <span className="text-sm font-medium">
              {user.wallet?.address?.substring(2, 4).toUpperCase()}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 mt-2">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          {user.wallet?.address?.slice(0, 6)}...
          {user.wallet?.address?.slice(-4)}
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
      <header className="flex h-14 w-full items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Right: Upload, Notifications, Profile */}
        <div className="flex items-center gap-2 ml-auto">
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
    <header className="flex h-14 w-full items-center bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Center: Search Bar */}
      <div className="mx-auto max-w-lg flex-1">
        <SearchBar />
      </div>
      {/* Right: Upload, Notifications & Profile Avatar */}
      <div className="flex items-center gap-3 ml-auto">
        <UploadButton />
        <NotificationsButton />
        <ProfileDropdown />
      </div>
    </header>
  );
}
