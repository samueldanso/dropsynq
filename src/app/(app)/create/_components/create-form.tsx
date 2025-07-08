"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivy } from "@privy-io/react-auth";
import type { ValidMetadataURI } from "@zoralabs/coins-sdk";
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { Image as ImageIcon, Music, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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

// Form validation schema
const createSongSchema = z.object({
	name: z.string().min(1, "Song name is required"),
	symbol: z
		.string()
		.min(1, "Coin symbol is required")
		.max(11, "Symbol must be 11 characters or less")
		.regex(/^[A-Z0-9]+$/, "Symbol must be uppercase letters and numbers only"),
	description: z.string().min(1, "Description is required"),
	genre: z.string().min(1, "Genre is required"),
	owners: z.string().optional(),
});

type CreateSongFormData = z.infer<typeof createSongSchema>;

const PLATFORM_REFERRER = "0xA44Fa8Ad3e905C8AB525cd0cb14319017F1e04e5";

// File upload component with drag & drop
function FileUpload({
	onFileSelect,
	acceptedTypes,
	label,
	icon: Icon,
	preview,
	onRemove,
}: {
	onFileSelect: (file: File) => void;
	acceptedTypes: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	preview?: { file: File; url: string };
	onRemove: () => void;
}) {
	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useId();

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);
			const file = e.dataTransfer.files[0];
			if (file && file.type.match(acceptedTypes)) {
				onFileSelect(file);
			}
		},
		[acceptedTypes, onFileSelect],
	);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onFileSelect(file);
		}
	};

	if (preview) {
		return (
			<div className="relative group">
				<div className="relative rounded-lg border-2 border-muted bg-muted p-6">
					{preview.file.type.startsWith("audio/") ? (
						<div className="flex items-center gap-4">
							<div className="flex size-16 items-center justify-center rounded-lg bg-primary/10">
								<Music className="size-8 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-medium truncate text-foreground">
									{preview.file.name}
								</p>
								<p className="text-sm text-muted-foreground">
									{(preview.file.size / 1024 / 1024).toFixed(2)} MB
								</p>
							</div>
							<AudioPreview url={preview.url} />
						</div>
					) : (
						<div className="relative">
							<Image
								src={preview.url}
								alt="Cover preview"
								width={400}
								height={192}
								className="w-full h-48 object-cover rounded-lg"
							/>
						</div>
					)}
					<button
						type="button"
						onClick={onRemove}
						className="absolute -top-2 -right-2 size-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
					>
						<X className="size-4" />
					</button>
				</div>
			</div>
		);
	}

	return (
		<label
			htmlFor={fileInputRef}
			className={`relative rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center p-8 cursor-pointer ${
				isDragOver
					? "border-primary bg-primary/5"
					: "border-primary/30 bg-muted/30"
			}`}
			onDragOver={(e) => {
				e.preventDefault();
				setIsDragOver(true);
			}}
			onDragLeave={() => setIsDragOver(false)}
			onDrop={(e) => {
				handleDrop(e);
			}}
			aria-label={label}
		>
			<input
				id={fileInputRef}
				type="file"
				accept={acceptedTypes}
				onChange={handleFileSelect}
				className="hidden"
			/>
			<Icon className="size-12 text-primary mb-4" />
			<p className="text-lg font-medium mb-2 text-primary">{label}</p>
			<p className="text-sm text-muted-foreground text-center">
				Drag and drop or click to upload
			</p>
		</label>
	);
}

// Audio preview component
function AudioPreview({ url }: { url: string }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio] = useState(new Audio(url));

	const togglePlay = () => {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		setIsPlaying(!isPlaying);
	};

	audio.onended = () => setIsPlaying(false);

	return (
		<button
			type="button"
			onClick={togglePlay}
			className="size-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
			aria-label={isPlaying ? "Pause audio" : "Play audio"}
		>
			{isPlaying ? (
				<Pause className="size-4 text-black" />
			) : (
				<Play className="size-4 text-black" />
			)}
		</button>
	);
}

export default function CreateForm() {
	const [audioFile, setAudioFile] = useState<File>();
	const [coverImage, setCoverImage] = useState<File>();
	const [audioPreview, setAudioPreview] = useState<string>();
	const [imagePreview, setImagePreview] = useState<string>();
	const [isUploading, setIsUploading] = useState(false);
	const router = useRouter();
	const { address: userAddress } = useAccount();
	const { data: walletClient } = useWalletClient();
	const { authenticated, login } = usePrivy();

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

	// Handle file selection with preview and size check
	const handleAudioSelect = (file: File) => {
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Audio file must be 5MB or less");
			return;
		}
		setAudioFile(file);
		const url = URL.createObjectURL(file);
		setAudioPreview(url);
	};

	const handleImageSelect = (file: File) => {
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Image must be 2MB or less");
			return;
		}
		setCoverImage(file);
		const url = URL.createObjectURL(file);
		setImagePreview(url);
	};

	const removeAudio = () => {
		setAudioFile(undefined);
		if (audioPreview) {
			URL.revokeObjectURL(audioPreview);
			setAudioPreview(undefined);
		}
	};

	const removeImage = () => {
		setCoverImage(undefined);
		if (imagePreview) {
			URL.revokeObjectURL(imagePreview);
			setImagePreview(undefined);
		}
	};

	// Upload to IPFS
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
		return result.metadataUri;
	};

	// Prepare coin params
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
		if (!authenticated) {
			login();
			return;
		}

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
			const uri = await uploadToIPFS(data);
			const params = prepareCoinParams(data, uri);
			const publicClient = createPublicClient({
				chain: base,
				transport: http(),
			});
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
			removeAudio();
			removeImage();
		} catch (error) {
			console.error("[CreateCoin] Error creating song coin:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to create song coin",
			);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md px-4">
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Audio Upload */}
						<div>
							<div
								className="text-sm font-bold mb-2"
								style={{ color: "#FF9900" }}
							>
								Audio File
							</div>
							<FileUpload
								onFileSelect={handleAudioSelect}
								acceptedTypes="audio/mp3,audio/wav"
								label="Upload Audio"
								icon={Music}
								preview={
									audioFile && audioPreview
										? { file: audioFile, url: audioPreview }
										: undefined
								}
								onRemove={removeAudio}
							/>
							<div className="text-xs text-muted-foreground mt-2">
								Supported: mp3, wav. Max 5MB.
							</div>
						</div>
						{/* Image Upload */}
						<div>
							<div
								className="text-sm font-bold mb-2"
								style={{ color: "#FF9900" }}
							>
								Cover Image
							</div>
							<FileUpload
								onFileSelect={handleImageSelect}
								acceptedTypes="image/jpeg,image/png,image/gif"
								label="Upload Cover"
								icon={ImageIcon}
								preview={
									coverImage && imagePreview
										? { file: coverImage, url: imagePreview }
										: undefined
								}
								onRemove={removeImage}
							/>
							<div className="text-xs text-muted-foreground mt-2">
								Supported: jpg, png, gif. Max 2MB.
							</div>
						</div>
						{/* Song Title */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-primary">Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter song title"
											{...field}
											className="border-0 bg-muted/50 focus:bg-muted focus:ring-2"
											style={
												{ "--tw-ring-color": "#FF9900" } as React.CSSProperties
											}
										/>
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
									<FormLabel className="text-primary">Symbol</FormLabel>
									<FormControl>
										<Input
											placeholder="SONG"
											{...field}
											onChange={(e) =>
												field.onChange(e.target.value.toUpperCase())
											}
											className="border-0 bg-muted/50 focus:bg-muted focus:ring-2 font-mono"
											style={
												{ "--tw-ring-color": "#FF9900" } as React.CSSProperties
											}
										/>
									</FormControl>
									<FormMessage />
									<div className="text-xs text-muted-foreground mt-1">
										Max 11 characters, uppercase letters and numbers only
									</div>
								</FormItem>
							)}
						/>
						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-primary">Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your song / lyrics..."
											className="min-h-[100px] border-0 bg-muted/50 focus:bg-muted focus:ring-2 resize-none"
											style={
												{ "--tw-ring-color": "#FF9900" } as React.CSSProperties
											}
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
									<FormLabel className="text-primary">Genre</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger
												className="border-0 bg-muted/50 focus:bg-muted focus:ring-2"
												style={
													{
														"--tw-ring-color": "#FF9900",
													} as React.CSSProperties
												}
											>
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
						{/* Create Button */}
						<Button
							type="submit"
							className="w-full h-16 text-lg font-semibold rounded-full shadow-none border-none"
							style={{ backgroundColor: "#FF9900", color: "#111" }}
							disabled={isUploading}
						>
							{isUploading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin size-5" viewBox="0 0 24 24">
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
								"Create"
							)}
						</Button>
						<div className="text-xs text-muted-foreground text-center mt-2">
							By creating a song coin, you confirm you have the rights to upload
							and share this music on Dropsynq.
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}
