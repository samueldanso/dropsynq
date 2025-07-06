"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ValidMetadataURI } from "@zoralabs/coins-sdk";
import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import { usePrivy } from "@privy-io/react-auth";
import { Image as ImageIcon, Music, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Address } from "viem";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    [acceptedTypes, onFileSelect]
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
        <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-6">
          {preview.file.type.startsWith("audio/") ? (
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-lg bg-primary/10">
                <Music className="size-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{preview.file.name}</p>
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
      className={`relative rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/50 transition-colors ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20 bg-muted/30"
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
      <Icon className="size-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium mb-2">{label}</p>
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
      className="size-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
    >
      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
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

  // Handle file selection with preview
  const handleAudioSelect = (file: File) => {
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioPreview(url);
  };

  const handleImageSelect = (file: File) => {
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
        error instanceof Error ? error.message : "Failed to create song coin"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Authentication Notice */}
      {!authenticated && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-muted-foreground/20">
          <p className="text-sm text-muted-foreground text-center">
            💡 You can explore the form below, but you'll need to sign in to
            create your song coin.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* File Uploads Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Upload Your Music</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Audio File</div>
                  <FileUpload
                    onFileSelect={handleAudioSelect}
                    acceptedTypes="audio/*"
                    label="Upload Audio"
                    icon={Music}
                    preview={
                      audioFile && audioPreview
                        ? { file: audioFile, url: audioPreview }
                        : undefined
                    }
                    onRemove={removeAudio}
                  />
                </div>
                <div className="space-y-4">
                  <div className="text-sm font-medium">Cover Image</div>
                  <FileUpload
                    onFileSelect={handleImageSelect}
                    acceptedTypes="image/*"
                    label="Upload Cover"
                    icon={ImageIcon}
                    preview={
                      coverImage && imagePreview
                        ? { file: coverImage, url: imagePreview }
                        : undefined
                    }
                    onRemove={removeImage}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Song Details Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Song Details</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Song Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter song title"
                          {...field}
                          className="border-0 bg-muted/50 focus:bg-muted focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coin Symbol</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., YSNG"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          className="border-0 bg-muted/50 focus:bg-muted focus:ring-2 focus:ring-primary/20 font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        Max 11 characters, uppercase letters and numbers only
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your song, inspiration, or story..."
                        className="min-h-[100px] border-0 bg-muted/50 focus:bg-muted focus:ring-2 focus:ring-primary/20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
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
                          <SelectTrigger className="border-0 bg-muted/50 focus:bg-muted focus:ring-2 focus:ring-primary/20">
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

                <FormField
                  control={form.control}
                  name="owners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Owners (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x123..., 0x456..."
                          {...field}
                          className="border-0 bg-muted/50 focus:bg-muted focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        Comma-separated wallet addresses
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Zora Protocol
              </Badge>
              <span>•</span>
              <span>Base Network</span>
              <span>•</span>
              <span>IPFS Storage</span>
            </div>

            <Button
              type="submit"
              className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
              ) : authenticated ? (
                "Create Song Coin"
              ) : (
                "Sign In to Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
