"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ValidMetadataURI } from "@zoralabs/coins-sdk";
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Address } from "viem";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
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

// Form validation schema - minimal required fields for Zora coin creation
const createSongSchema = z.object({
	name: z.string().min(1, "Song name is required"),
	symbol: z
		.string()
		.min(1, "Coin symbol is required")
		.max(11, "Symbol must be 11 characters or less")
		.regex(/^[A-Z0-9]+$/, "Symbol must be uppercase letters and numbers only"),
	description: z.string().min(1, "Description is required"),
	genre: z.string().min(1, "Genre is required"),
	owners: z.string().optional(), // comma-separated addresses
});

type CreateSongFormData = z.infer<typeof createSongSchema>;

const PLATFORM_REFERRER = "0xA44Fa8Ad3e905C8AB525cd0cb14319017F1e04e5";

export default function CreateForm() {
	const audioFileId = useId();
	const coverImageId = useId();
	const [audioFile, setAudioFile] = useState<File>();
	const [coverImage, setCoverImage] = useState<File>();
	const [isUploading, setIsUploading] = useState(false);
	const router = useRouter();
	const { address: userAddress } = useAccount();
	const { data: walletClient } = useWalletClient();

	const form = useForm<CreateSongFormData>({
		resolver: zodResolver(createSongSchema),
		defaultValues: {
			name: "",
			symbol: "",
			description: "",
			genre: "",
			owners: "",
		},
	});

	// Step 1: Upload files and metadata to IPFS (backend)
	const uploadToIPFS = async (data: CreateSongFormData) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});
		if (audioFile) formData.append("audioFile", audioFile);
		if (coverImage) formData.append("coverImage", coverImage);

		const response = await fetch("/api/songs/upload", {
			method: "POST",
			body: formData,
		});
		const result = await response.json();
		if (!response.ok)
			throw new Error(result.error || "Failed to upload metadata");
		return result.metadataUri; // Expect backend to return metadataUri
	};

	// Step 2: Prepare coin params for Zora SDK
	const prepareCoinParams = (data: CreateSongFormData, uri: string) => {
		if (!userAddress) throw new Error("Wallet not connected");
		let owners: Address[] | undefined;
		if (data.owners && data.owners.trim().length > 0) {
			owners = data.owners
				.split(",")
				.map((addr) => addr.trim() as Address)
				.filter((addr) => addr.length > 0);
		}
		const params = {
			name: data.name,
			symbol: data.symbol,
			uri: uri as ValidMetadataURI,
			payoutRecipient: userAddress as Address,
			platformReferrer: PLATFORM_REFERRER as Address,
			owners,
			chainId: base.id,
			currency: DeployCurrency.ZORA,
		};
		return params;
	};

	const onSubmit = async (data: CreateSongFormData) => {
		if (!audioFile || !coverImage) {
			toast.error("Please select both audio file and cover image");
			return;
		}
		if (!userAddress) {
			toast.error("Connect your wallet to mint");
			return;
		}
		if (!walletClient) {
			toast.error("Wallet client not available");
			return;
		}
		setIsUploading(true);
		try {
			// 1. Upload to IPFS
			const uri = await uploadToIPFS(data);
			// 2. Prepare coin params
			const params = prepareCoinParams(data, uri);
			// 3. Create public client for the correct chain
			const publicClient = createPublicClient({
				chain: base,
				transport: http(),
			});
			// 4. Call createCoin directly (no simulation)
			const result = await createCoin(params, walletClient, publicClient, {
				gasMultiplier: 120,
			});
			toast.success("Song coin minted! Waiting for confirmation...");
			await fetch("/api/songs/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.name,
					description: data.description,
					image_url: params.uri,
					audio_url: params.uri,
					metadata_url: params.uri,
					coin_address: result.address,
					creator_address: userAddress,
				}),
			});
			router.push(`/track/${result.address}`);
			form.reset();
			setAudioFile(undefined);
			setCoverImage(undefined);
		} catch (error) {
			console.error("[CreateCoin] Error creating song coin:", error);
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

					{/* Coin Symbol */}
					<FormField
						control={form.control}
						name="symbol"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Coin Symbol</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g., YSNG (max 11 chars, uppercase)"
										{...field}
										onChange={(e) =>
											field.onChange(e.target.value.toUpperCase())
										}
									/>
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

					{/* Additional Owners (comma-separated) */}
					<FormField
						control={form.control}
						name="owners"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Additional Owners (optional)</FormLabel>
								<FormControl>
									<Input
										placeholder="0x123..., 0x456... (comma-separated)"
										{...field}
									/>
								</FormControl>
								<FormMessage />
								<div className="text-xs text-muted-foreground">
									Additional addresses that can manage this coin's metadata and
									payouts
								</div>
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
						{isUploading ? (
							<span className="flex items-center justify-center gap-2">
								<svg className="animate-spin size-4" viewBox="0 0 24 24">
									<title>Loading</title>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8z"
									/>
								</svg>
								Creating Song Coin...
							</span>
						) : (
							"Create Song Coin"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
