import { getCoin } from "@zoralabs/coins-sdk";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { baseSepolia } from "viem/chains";
import { db } from "@/lib/db";
import { tracks } from "@/lib/db/schemas/tracks";

interface TrackDetailsProps {
	id: string;
}

export default async function TrackDetails({ id }: TrackDetailsProps) {
	// --- Step 1: Fetch cached data from our DB first ---
	const dbTrack = await db.query.tracks.findFirst({
		where: eq(tracks.coin_address, id),
	});

	// --- Step 2: Fetch live on-chain data from Zora ---
	const zoraResponse = await getCoin({ address: id, chain: baseSepolia.id });
	const zoraCoin = zoraResponse.data?.zora20Token;

	// If neither source has data, the track doesn't exist.
	if (!dbTrack && !zoraCoin) {
		return <div className="text-center text-red-500">Track not found.</div>;
	}

	// --- Step 3: Combine data, prioritizing DB cache for metadata ---
	const trackName = dbTrack?.name || zoraCoin?.name;
	const trackDescription = dbTrack?.description || zoraCoin?.description;
	const artist = dbTrack?.creator_address || zoraCoin?.creatorAddress;
	const image = dbTrack?.image_url?.replace("ipfs://", "https://ipfs.io/ipfs/");
	const audio = dbTrack?.audio_url?.replace("ipfs://", "https://ipfs.io/ipfs/");

	return (
		<div className="max-w-2xl mx-auto py-8">
			<div className="flex flex-col items-center gap-6">
				{image && (
					<Image
						src={image}
						alt={trackName || "cover"}
						width={320}
						height={320}
						className="rounded-lg"
					/>
				)}
				<h1 className="text-3xl font-bold">{trackName}</h1>
				<div className="text-lg text-muted-foreground">by {artist}</div>
				<div className="text-base text-center mb-4">{trackDescription}</div>
				{audio && (
					<audio controls src={audio} className="w-full">
						Your browser does not support the audio element.
					</audio>
				)}

				{/* Display live on-chain data */}
				{zoraCoin && (
					<div className="mt-6 w-full grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
						<div>
							<div className="text-xs text-muted-foreground">Symbol</div>
							<div className="font-mono">{zoraCoin.symbol}</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Total Supply</div>
							<div>{zoraCoin.totalSupply}</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Holders</div>
							<div>{zoraCoin.uniqueHolders}</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Contract</div>
							<a
								href={`https://sepolia.basescan.org/address/${zoraCoin.address}`}
								target="_blank"
								rel="noopener"
								className="underline text-blue-500"
							>
								{zoraCoin.address.slice(0, 8)}...
								{zoraCoin.address.slice(-4)}
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
