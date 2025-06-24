"use client";

import { Image as ImageIcon, Loader2, Music, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateForm() {
	// Track creation state
	const [trackName, setTrackName] = useState("");
	const [symbol, setSymbol] = useState("");
	const [description, setDescription] = useState("");
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [coverImage, setCoverImage] = useState<File | null>(null);
	const [isCreatingTrack, setIsCreatingTrack] = useState(false);

	// Generate unique IDs
	const trackNameId = useId();
	const symbolId = useId();
	const descriptionId = useId();
	const audioId = useId();
	const coverId = useId();

	const { address } = useAccount();
	const router = useRouter();

	// New track creation functions
	const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 50 * 1024 * 1024) {
				toast.error("Audio file must be less than 50MB");
				return;
			}
			setAudioFile(file);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image file must be less than 5MB");
				return;
			}
			setCoverImage(file);
		}
	};

	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const result = reader.result as string;
				const base64 = result.split(",")[1];
				resolve(base64);
			};
			reader.onerror = reject;
		});
	};

	const createTrack = async () => {
		if (!address) {
			toast.error("Please connect your wallet");
			return;
		}

		if (!audioFile) {
			toast.error("Please select an audio file");
			return;
		}

		if (!trackName || !symbol || !description) {
			toast.error("Please fill in all required fields");
			return;
		}

		setIsCreatingTrack(true);

		try {
			const audioBase64 = await fileToBase64(audioFile);
			const imageBase64 = coverImage
				? await fileToBase64(coverImage)
				: undefined;

			const requestData = {
				name: trackName,
				symbol: symbol.toUpperCase(),
				description,
				audioFile: audioBase64,
				coverImage: imageBase64,
			};

			const response = await fetch("/api/tracks/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to create track");
			}

			toast.success("Track created successfully!");
			router.push(`/track/${result.coin.address}`);
		} catch (error) {
			console.error("Error creating track:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create track",
			);
		} finally {
			setIsCreatingTrack(false);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<div className="mx-auto max-w-4xl space-y-8">
				{/* Track Creation Form */}
				<Card>
					<CardHeader>
						<CardTitle>Create New Track</CardTitle>
						<CardDescription>
							Upload your music and create a tokenized coin on Zora
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Track Name */}
						<div className="space-y-2">
							<Label htmlFor={trackNameId}>Track Name *</Label>
							<Input
								id={trackNameId}
								value={trackName}
								onChange={(e) => setTrackName(e.target.value)}
								placeholder="Enter track name"
								disabled={isCreatingTrack}
							/>
						</div>

						{/* Symbol */}
						<div className="space-y-2">
							<Label htmlFor={symbolId}>Symbol *</Label>
							<Input
								id={symbolId}
								value={symbol}
								onChange={(e) => setSymbol(e.target.value)}
								placeholder="e.g., SONG"
								maxLength={10}
								disabled={isCreatingTrack}
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor={descriptionId}>Description *</Label>
							<Textarea
								id={descriptionId}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Describe your track..."
								rows={3}
								disabled={isCreatingTrack}
							/>
						</div>

						{/* Audio File Upload */}
						<div className="space-y-2">
							<Label htmlFor={audioId}>Audio File *</Label>
							<div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-6 text-center">
								<input
									id={audioId}
									type="file"
									accept="audio/*"
									onChange={handleAudioChange}
									disabled={isCreatingTrack}
									className="hidden"
								/>
								<label htmlFor={audioId} className="cursor-pointer">
									<Music className="mx-auto mb-2 size-8 text-muted-foreground" />
									<p className="text-muted-foreground text-sm">
										{audioFile ? audioFile.name : "Click to upload audio file"}
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										MP3, WAV, or FLAC (max 50MB)
									</p>
								</label>
							</div>
						</div>

						{/* Cover Image Upload */}
						<div className="space-y-2">
							<Label htmlFor={coverId}>Cover Image (Optional)</Label>
							<div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-6 text-center">
								<input
									id={coverId}
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									disabled={isCreatingTrack}
									className="hidden"
								/>
								<label htmlFor={coverId} className="cursor-pointer">
									<ImageIcon className="mx-auto mb-2 size-8 text-muted-foreground" />
									<p className="text-muted-foreground text-sm">
										{coverImage
											? coverImage.name
											: "Click to upload cover image"}
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										JPG, PNG, or GIF (max 5MB)
									</p>
								</label>
							</div>
						</div>

						{/* Create Track Button */}
						<Button
							onClick={createTrack}
							disabled={isCreatingTrack || !address}
							className="w-full"
						>
							{isCreatingTrack ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Creating Track...
								</>
							) : (
								<>
									<Upload className="mr-2 size-4" />
									Create Track
								</>
							)}
						</Button>

						{!address && (
							<p className="text-center text-muted-foreground text-sm">
								Please connect your wallet to create a track
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
