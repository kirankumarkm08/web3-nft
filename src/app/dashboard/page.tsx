"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useChainId } from "wagmi";
import { fetchNFTs, type NFT } from "@/lib/nft-service";
import NFTCard from "@/components/nft-card";
import { WalletInfo } from "@/components/Wallet-info";
import { base } from "wagmi/chains";

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balanceData } = useBalance({ address });

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get network name based on chain ID
  const networkName = chainId === base.id ? "Base" : "Unknown";

  // Get explorer URL
  const getExplorerUrl = (address: string) => {
    return `https://basescan.org/address/${address}`;
  };

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Fetch NFTs
  useEffect(() => {
    async function getNFTs() {
      if (!isConnected || !address) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchNFTs(address);
        setNfts(data);
      } catch (err) {
        setError("Failed to fetch NFTs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getNFTs();
  }, [address, isConnected]);

  if (!isConnected) return null;

  return (
    <main className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NFT Dashboard</h1>
        <ConnectButton showBalance={false} />
      </div>

      <WalletInfo
        address={address || ""}
        networkName={networkName}
        balance={balanceData?.formatted || "0"}
        getExplorerUrl={getExplorerUrl}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your NFTs</h2>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-[300px] w-full rounded-t-md" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Image
              src="/abstract-nft-concept.png"
              alt="No NFTs"
              width={100}
              height={100}
            />
            <p className="mt-4 text-center text-muted-foreground">
              No NFTs found in your wallet
            </p>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Try getting some NFTs on the Base network
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
