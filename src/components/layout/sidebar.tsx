"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Home, PlusSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const links = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/create", label: "Create", icon: PlusSquare },
];

export function Sidebar() {
	const pathname = usePathname();
	const { ready, authenticated, user, login } = usePrivy();

	const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!authenticated) {
			e.preventDefault();
			login();
		}
	};

	const profileHref =
		ready && authenticated && user?.wallet ? `/profile/${user.wallet.address}` : "/";

	return (
		<aside className="hidden h-full w-60 flex-col justify-between border-r bg-background p-4 md:flex">
			<nav className="flex flex-col space-y-2">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={cn(
							"flex items-center space-x-2 rounded-md p-2 hover:bg-muted",
							pathname === link.href && "bg-muted",
						)}
					>
						<link.icon className="size-5" />
						<span>{link.label}</span>
					</Link>
				))}

				<Link
					href={profileHref}
					onClick={handleProfileClick}
					className={cn(
						"flex items-center space-x-2 rounded-md p-2 hover:bg-muted",
						pathname.startsWith("/profile") && "bg-muted",
					)}
				>
					<User className="size-5" />
					<span>Profile</span>
				</Link>
			</nav>
			<ThemeToggle />
		</aside>
	);
}
