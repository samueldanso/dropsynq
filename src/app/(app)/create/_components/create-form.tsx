"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ValidMetadataURI } from "@zoralabs/coins-sdk";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount, useSimulateContract, useWriteContract } from "wagmi";
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
});

type CreateSongFormData = z.infer<typeof createSongSchema>;

export default function CreateForm() {
	const audioFileId = useId();
	const coverImageId = useId();
	const [audioFile, setAudioFile] = useState<File>();
	const [coverImage, setCoverImage] = useState<File>();
	const [isUploading, setIsUploading] = useState(false);
	const router = useRouter();
	const { address: userAddress } = useAccount();
	const [metadataUri, setMetadataUri] = useState<string | null>(null);
	const [coinParams, setCoinParams] = useState<any>(null);

	const form = useForm<CreateSongFormData>({
		resolver: zodResolver(createSongSchema),
		defaultValues: {
			name: "",
			symbol: "",
			description: "",
			genre: "",
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

		return {
			name: data.name,
			symbol: data.symbol,
			uri: uri as ValidMetadataURI,
			payoutRecipient: userAddress as `0x${string}`,
			// Optional: Add platform referrer for your platform
			// platformReferrer: "0xYourPlatformAddress" as `0x${string}`,
			// Optional: Set initial purchase to 0 for no initial liquidity
			// initialPurchaseWei: 0n,
		};
	};

	// Step 3: Simulate and write contract
	const {
		data: simulation,
		isLoading: isSimulating,
		error: simulationError,
	} = useSimulateContract(
		coinParams
			? { ...(createCoinCall(coinParams) as any), account: userAddress }
			: undefined,
	);
	const { writeContractAsync, isPending: isMinting } = useWriteContract();

	const onSubmit = async (data: CreateSongFormData) => {
		if (!audioFile || !coverImage) {
			toast.error("Please select both audio file and cover image");
			return;
		}
		if (!userAddress) {
			toast.error("Connect your wallet to mint");
			return;
		}
		setIsUploading(true);
		try {
			// 1. Upload to IPFS
			const uri = await uploadToIPFS(data);
			setMetadataUri(uri);

			// 2. Prepare coin params
			const params = prepareCoinParams(data, uri);
			setCoinParams(params);

			// 3. Simulate contract
			const contractCall = createCoinCall(params);
			if (!simulation || !simulation.request) {
				toast.error("Simulation failed. Please check your input.");
				setIsUploading(false);
				return;
			}
			const { request } = simulation;

			// 4. Mint coin
			const tx = await writeContractAsync(request);
			toast.success("Song coin minted! Waiting for confirmation...");

			// 5. Save to DB
			await fetch("/api/songs/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.name,
					description: data.description,
					image_url: uri, // or extract from metadata
					audio_url: uri, // or extract from metadata
					metadata_url: uri,
					coin_address: tx, // or extract from receipt
					creator_address: userAddress, // Use connected wallet
				}),
			});

			router.push(`/track/${tx}`);
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
