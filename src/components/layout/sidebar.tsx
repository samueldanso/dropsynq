"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Home, PlusSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	Sidebar as UISidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const links = [{ href: "/", label: "Home", icon: Home }];

export function AppSidebar() {
	const pathname = usePathname();
	const { ready, authenticated, user, login } = usePrivy();

	const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!authenticated) {
			e.preventDefault();
			login();
		}
	};

	const profileHref =
		ready && authenticated && user?.wallet
			? `/profile/${user.wallet.address}`
			: "/";

	return (
		<SidebarProvider>
			<UISidebar className="h-full flex-col justify-between border-r bg-background p-0 md:flex w-60">
				<SidebarHeader className="flex items-center h-16 px-6 border-b">
					{/* Logo slot */}
					<span className="font-bold text-xl tracking-tight">SoundCoin</span>
					<SidebarTrigger className="ml-auto" />
				</SidebarHeader>
				<SidebarContent className="flex-1 flex flex-col justify-between">
					<SidebarMenu className="flex flex-col space-y-2 px-4 pt-6">
						{links.map((link) => (
							<SidebarMenuItem key={link.href}>
								<Link href={link.href} passHref legacyBehavior>
									<SidebarMenuButton
										asChild
										isActive={pathname === link.href}
										className={cn(
											"flex items-center gap-3 rounded-lg px-3 py-3 font-medium transition-colors",
											pathname === link.href
												? "text-foreground bg-muted"
												: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
										)}
									>
										<>
											<link.icon className="h-5 w-5" />
											<span>{link.label}</span>
										</>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						))}
						<SidebarMenuItem>
							<Link
								href={profileHref}
								onClick={handleProfileClick}
								passHref
								legacyBehavior
							>
								<SidebarMenuButton
									asChild
									isActive={pathname.startsWith("/profile")}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-3 font-medium transition-colors",
										pathname.startsWith("/profile")
											? "text-foreground bg-muted"
											: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
									)}
								>
									<>
										<User className="h-5 w-5" />
										<span>Profile</span>
									</>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
					<div className="px-4 pb-4 mt-auto">
						<ThemeToggle />
					</div>
				</SidebarContent>
			</UISidebar>
		</SidebarProvider>
	);
}
