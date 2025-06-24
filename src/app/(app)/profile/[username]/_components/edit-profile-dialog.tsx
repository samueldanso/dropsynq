import { Pencil } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ZoraProfile } from "@/types/profile";

interface EditProfileDialogProps {
	profile: ZoraProfile;
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
	const [displayName, setDisplayName] = useState(profile.displayName || "");
	const [bio, setBio] = useState(profile.bio || "");
	const id = useId();

	// TODO: Research how to update Zora profiles. The Coins SDK does not seem to support this.
	// The mutation and save logic will be implemented here once the method is clear.
	const handleSave = () => {
		console.log("Saving profile...", { displayName, bio });
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2 rounded-full px-8">
					<Pencil className="size-4" />
					Edit Profile
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor={`${id}-displayName`} className="text-right">
							Name
						</Label>
						<Input
							id={`${id}-displayName`}
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor={`${id}-bio`} className="text-right">
							Bio
						</Label>
						<Textarea
							id={`${id}-bio`}
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="col-span-3"
						/>
					</div>
				</div>
				<Button onClick={handleSave} disabled>
					Save Changes (Disabled)
				</Button>
			</DialogContent>
		</Dialog>
	);
}
