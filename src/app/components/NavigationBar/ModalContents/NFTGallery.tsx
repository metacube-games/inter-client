"use client";

import { useGStore } from "@/app/store/store";
import React, { useState, useEffect, useCallback } from "react";
import { RpcProvider, Contract } from "starknet";

interface NFTData {
  placeHolder?: boolean;
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  attributes?: {
    trait_type?: string;
    value?: string;
  }[];
}

const MGenesisAddress =
  "0x007ca74fd0a9239678cc6355e38ac1e7820141501727ae37f9c733e5ed1c3592";
let provider: RpcProvider | undefined;
let metacubContract: Contract | undefined;

const generateProvider = async () => {
  if (provider) return;
  provider = new RpcProvider({
    nodeUrl:
      "https://starknet-mainnet.g.alchemy.com/v2/k7qcr3I6vKHCjdIvLQnFq1DwvNSYqKmK",
  });
  const metacubeRootAbi = await provider.getClassAt(MGenesisAddress);
  metacubContract = new Contract(
    metacubeRootAbi.abi,
    MGenesisAddress,
    provider
  );
};
generateProvider();

let tokenIds: number[] = [];
let nftsData: NFTData[] = [];
let lastFetchedAddress = "";

export function NFTGallery() {
  const walletAddress = useGStore((state) => state.walletAddress);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (walletAddress.length < 5) return;
    setError(null);
    setLoading(true);

    try {
      const totalNFTs = Number(
        await metacubContract?.call("balanceOf", [walletAddress])
      );
      const sameUser = walletAddress === lastFetchedAddress;

      if (!sameUser) nftsData = [];
      if ((nftsData.length === totalNFTs && sameUser) || totalNFTs === 0) {
        setNfts(nftsData);
        setLoading(false);
        return;
      }

      tokenIds = [];
      for (let i = 0; i < 75; i += 5) {
        const batch = Array.from({ length: 5 }, (_, index) => index + i);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await processBatch(walletAddress, batch);
        if (tokenIds.length >= totalNFTs) break;
      }

      const nftDetails = tokenIds.map(() => ({
        animation_url: "https://felts.xyz/a/v.mp4",
        image: "https://felts.xyz/a/g.gif",
        name: "Genesis",
      }));

      setNfts(nftDetails);
      nftsData = nftDetails;
    } catch (err) {
      setError("Failed to fetch NFTs.");
      console.error(err);
    } finally {
      setLoading(false);
      lastFetchedAddress = walletAddress;
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  if (error) {
    return (
      <p className="text-red-500">
        Oops! We couldn't load the NFTs. Please try again in a moment.
      </p>
    );
  }

  if (!walletAddress || walletAddress.length <= 0) {
    return (
      <div className="h-[calc(100vh-300px)] flex items-center justify-center text-green-400 text-lg sm:text-xl">
        Wallet is not connected
      </div>
    );
  }

  if (nfts.length === 0 && !loading) {
    return (
      <div className="h-[calc(100vh-300px)] flex items-center justify-center text-green-400 text-xl">
        Hey soldier, keep mining to get your first NFT!
      </div>
    );
  }

  return <NFTGrid nfts={nfts} loading={loading} tokenIds={tokenIds} />;
}

async function processBatch(userAddress: string, batch: number[]) {
  const checkOwnership = async (index: number) => {
    const ownerAddress = await metacubContract?.call("ownerOf", [index]);
    const transformedAddress = `0x${ownerAddress?.toString(16)}`;
    if (transformedAddress === userAddress && !tokenIds.includes(index)) {
      tokenIds.push(index);
    }
  };

  const promises = batch.map((index) => checkOwnership(index));
  await Promise.all(promises);
}

function NFTGrid({
  nfts,
  loading,
  tokenIds,
}: {
  nfts: NFTData[];
  loading: boolean;
  tokenIds: number[];
}) {
  const skeletonCount = 8;
  const displayNfts = loading ? Array(skeletonCount).fill({}) : nfts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayNfts.map((nft, index) => (
        <NFTCard
          key={index}
          nft={nft}
          loading={loading}
          tokenId={tokenIds[index]}
        />
      ))}
    </div>
  );
}

function NFTCard({
  nft,
  loading,
  tokenId,
}: {
  nft: NFTData;
  loading: boolean;
  tokenId?: number;
}) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 bg-gray-700 animate-pulse" />
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img
        src={nft.image}
        alt={nft.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex justify-between items-center">
        <span className="text-green-400">{nft.name}</span>
        <span className="text-green-400">N°{tokenId}</span>
      </div>
    </div>
  );
}
