"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Form validation schema - minimal required fields
const createSongSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	creator: z.string().min(1, "Creator is required"),
	genre: z.string().min(1, "Genre is required"),
	payoutRecipient: z.string().min(42, "Valid wallet address required"),
});

type CreateSongFormData = z.infer<typeof createSongSchema>;

export default function CreateForm() {
	const audioFileId = useId();
	const coverImageId = useId();
	const [audioFile, setAudioFile] = useState<File>();
	const [coverImage, setCoverImage] = useState<File>();
	const [isUploading, setIsUploading] = useState(false);
	const router = useRouter();

	const form = useForm<CreateSongFormData>({
		resolver: zodResolver(createSongSchema),
		defaultValues: {
			name: "",
			description: "",
			creator: "",
			genre: "",
			payoutRecipient: "",
		},
	});

	const onSubmit = async (data: CreateSongFormData) => {
		if (!audioFile || !coverImage) {
			toast.error("Please select both audio file and cover image");
			return;
		}

		setIsUploading(true);

		try {
			const formData = new FormData();

			// Add form fields
			Object.entries(data).forEach(([key, value]) => {
				if (value) formData.append(key, value);
			});

			// Add files
			formData.append("audioFile", audioFile);
			formData.append("coverImage", coverImage);

			const response = await fetch("/api/songs/create", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to create song coin");
			}

			toast.success("Song coin created successfully!");
			console.log("Coin address:", result.coinAddress);
			console.log("Transaction hash:", result.transactionHash);

			// Redirect to the new track page
			if (result.coinAddress) {
				router.push(`/track/${result.coinAddress}`);
			}

			// Reset form
			form.reset();
			setAudioFile(undefined);
			setCoverImage(undefined);
		} catch (error) {
			console.error("Error creating song coin:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create song coin",
			);
		} finally {
			setIsUploading(false);
		}
	};

	const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("audio/")) {
			setAudioFile(file);
		} else {
			toast.error("Please select a valid audio file");
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			setCoverImage(file);
		} else {
			toast.error("Please select a valid image file");
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Song Name */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Song Title</FormLabel>
								<FormControl>
									<Input placeholder="Enter song title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Creator */}
					<FormField
						control={form.control}
						name="creator"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Artist</FormLabel>
								<FormControl>
									<Input placeholder="Enter artist name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Describe your song..."
										className="min-h-[100px]"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Genre */}
					<FormField
						control={form.control}
						name="genre"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Genre</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select genre" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Electronic">Electronic</SelectItem>
										<SelectItem value="Hip Hop">Hip Hop</SelectItem>
										<SelectItem value="Rock">Rock</SelectItem>
										<SelectItem value="Pop">Pop</SelectItem>
										<SelectItem value="Jazz">Jazz</SelectItem>
										<SelectItem value="Classical">Classical</SelectItem>
										<SelectItem value="Country">Country</SelectItem>
										<SelectItem value="R&B">R&B</SelectItem>
										<SelectItem value="Other">Other</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Payout Recipient */}
					<FormField
						control={form.control}
						name="payoutRecipient"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Payout Wallet Address</FormLabel>
								<FormControl>
									<Input placeholder="0x..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Audio File Upload */}
					<div className="space-y-2">
						<label htmlFor={audioFileId} className="text-sm font-medium">
							Audio File
						</label>
						<Input
							id={audioFileId}
							type="file"
							accept="audio/*"
							onChange={handleAudioChange}
							className="cursor-pointer"
						/>
						{audioFile && (
							<p className="text-sm text-muted-foreground">
								Selected: {audioFile.name}
							</p>
						)}
					</div>

					{/* Cover Image Upload */}
					<div className="space-y-2">
						<label htmlFor={coverImageId} className="text-sm font-medium">
							Cover Image
						</label>
						<Input
							id={coverImageId}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="cursor-pointer"
						/>
						{coverImage && (
							<p className="text-sm text-muted-foreground">
								Selected: {coverImage.name}
							</p>
						)}
					</div>

					{/* Submit Button */}
					<Button type="submit" className="w-full" disabled={isUploading}>
						{isUploading ? "Creating Song Coin..." : "Create Song Coin"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
