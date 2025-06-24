import { getCoin } from "@zoralabs/coins-sdk";
import Image from "next/image";
import { baseSepolia } from "viem/chains";

interface TrackDetailsProps {
  id: string;
}

interface Metadata {
  image?: string;
  animation_url?: string;
  description?: string;
  name?: string;
  properties?: {
    creator?: string;
  };
}

export default async function TrackDetails({ id }: TrackDetailsProps) {
  const response = await getCoin({ address: id, chain: baseSepolia.id });
  const coin = response.data?.zora20Token;

  if (!coin) {
    return <div className="text-center text-red-500">Track not found.</div>;
  }

  let metadata: Metadata = {};
  const anyCoin = coin as any;
  // The metadata URI is often in a `uri` or `tokenURI` field.
  const metadataURI = anyCoin.uri || anyCoin.tokenURI;

  if (metadataURI && metadataURI.startsWith("ipfs://")) {
    const metadataGatewayURL = metadataURI.replace(
      "ipfs://",
      "https://ipfs.io/ipfs/"
    );
    try {
      const metadataResponse = await fetch(metadataGatewayURL);
      if (metadataResponse.ok) {
        metadata = await metadataResponse.json();
      }
    } catch (e) {
      console.error("Failed to fetch metadata from IPFS:", e);
    }
  }

  const image = metadata.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const audio = metadata.animation_url?.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );

  const trackName = metadata.name || coin.name;
  const trackDescription = metadata.description || coin.description;
  const artist = metadata.properties?.creator || coin.creatorAddress;

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
        <div className="mt-6 w-full grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">Symbol</div>
            <div className="font-mono">{coin.symbol}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Supply</div>
            <div>{coin.totalSupply}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Holders</div>
            <div>{coin.uniqueHolders}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Contract</div>
            <a
              href={`https://sepolia.basescan.org/address/${coin.address}`}
              target="_blank"
              rel="noopener"
              className="underline text-blue-500"
            >
              {coin.address.slice(0, 8)}...{coin.address.slice(-4)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
