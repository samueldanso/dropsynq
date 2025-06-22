// This component will be used to display user profile pictures.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
	src?: string;
	alt: string;
	size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
	sm: "size-8",
	md: "size-12",
	lg: "size-20",
	xl: "size-28",
};

export function UserAvatar({ src, alt, size = "md" }: UserAvatarProps) {
	const fallbackText = alt.charAt(0).toUpperCase();
	const avatarSize = sizeMap[size];

	return (
		<Avatar className={cn(avatarSize)}>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback>{fallbackText}</AvatarFallback>
		</Avatar>
	);
}
