import { useAuthStore } from "@/app/store/authStore";
import React, { useState, useEffect, useCallback } from "react";
import { RpcProvider, Contract, BigNumberish, num, Result } from "starknet";

const MGenesisAddress =
  "0x007ca74fd0a9239678cc6355e38ac1e7820141501727ae37f9c733e5ed1c3592";
const ALCHEMY_API_KEY = "k7qcr3I6vKHCjdIvLQnFq1DwvNSYqKmK";

let provider: RpcProvider | undefined = undefined;
let metacubContract: Contract | undefined = undefined;
const generateProvider = async () => {
  if (provider) return;
  provider = new RpcProvider({
    nodeUrl: `https://starknet-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  });
  const metacubeRootAbi = await provider.getClassAt(MGenesisAddress);
  metacubContract = new Contract(
    metacubeRootAbi.abi,
    MGenesisAddress,
    provider
  );
};
generateProvider();

interface nftdata {
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

let tokenIds: number[] = [];
let nftsData: nftdata[] = [];
let lastFetchedAdress = "";

export const NFTGallery: React.FC = () => {
  const walletAddress = useAuthStore((state) => state.walletAddress);
  const isLogin = useAuthStore((state) => state.isConnected);
  const [nfts, setNfts] = useState<nftdata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    setError(null);

    if (walletAddress.length < 5) return;
    try {
      const totalNFTs = Number(
        await metacubContract?.call("balanceOf", [walletAddress])
      );
      const sameUser = walletAddress === lastFetchedAdress;
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

      // wait 1 seconds
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const nftDetails = tokenIds.map(() => {
        return {
          animation_url: "https://felts.xyz/a/v.mp4",
          // attributes: [{ trait_type: "type", value: "card" }],
          // 0: { trait_type: "type", value: "card" },
          // description:
          //   "The Metacube Genesis Card is the rarest item in the Metacube Universe. With only 75 units available, each one of these cards provides its owner with access to free in-game items and special advantages at the various Metacube events.",
          image: "https://felts.xyz/a/g.gif",
          name: "Genesis",
        };
      });

      // tokenIds = [777];
      // const nftDetails = tokenIds.map(() => {
      //   return {
      //     animation_url: nftImage,
      //     // attributes: [{ trait_type: "type", value: "card" }],
      //     // 0: { trait_type: "type", value: "card" },
      //     // description:
      //     //   "The Metacube Genesis Card is the rarest item in the Metacube Universe. With only 75 units available, each one of these cards provides its owner with access to free in-game items and special advantages at the various Metacube events.",
      //     image: nftImage,
      //     name: "Metacube: Pass Card",
      //   };
      // });
      // }
      // not needed as alway same URI but keep theem for future code
      // const nftDetails = await Promise.all(
      //   tokenIds.map(async (tokenId) => {
      //     const uriResponse = await metacubContract?.call("tokenURI", [
      //       tokenId,
      //     ]);
      //     const uriJson = feltToStr(uriResponse as bigint);
      //     const metadataResponse = await axios.get(uriJson);
      //     return metadataResponse.data;
      //   })
      // );

      setNfts(nftDetails);
      nftsData = nftDetails;
    } catch (err) {
      setError("Failed to fetch NFTs.");
      console.error(err);
    } finally {
      setLoading(false);
      lastFetchedAdress = walletAddress;
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  if (true) {
    return <EmptyState message="Coming soon" />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!isLogin) {
    return <EmptyState message="Not logged in" />;
  }

  if (walletAddress.length <= 3) {
    return <EmptyState message="Keep mining to get your first NFT!" />;
  }

  if (nfts.length === 0 && !loading) {
    return <EmptyState message="Keep mining to get your first NFT!" />;
  }

  return <NFTGrid nfts={nfts} loading={loading} tokenIds={tokenIds} />;
};
const processBatch = async (userAddress: string, batch: any[]) => {
  const checkOwnership = async (index: number) => {
    const ownerAddress = await metacubContract?.call("ownerOf", [index]);
    const transformedAdress = `0x${ownerAddress?.toString(16)}`;
    if (transformedAdress === userAddress) {
      //check if index is already in tokenIds
      if (!tokenIds.includes(index)) {
        tokenIds.push(index);
      }
    }
  };

  const promises = batch.map((index) => checkOwnership(index));
  await Promise.all(promises);
};
const NFTGrid: React.FC<{
  nfts: nftdata[];
  loading: boolean;
  tokenIds: number[];
}> = React.memo(({ nfts, loading, tokenIds }) => {
  const placeholders = Array(8).fill(null);
  const items = loading ? placeholders : nfts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((nft, index) => (
        <NFTCard
          key={index}
          nft={nft}
          loading={loading}
          tokenId={tokenIds[index]}
        />
      ))}
    </div>
  );
});

const NFTCard: React.FC<{
  nft: nftdata | null;
  loading: boolean;
  tokenId?: number;
}> = ({ nft, loading, tokenId }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
    {loading ? (
      <NFTCardSkeleton />
    ) : (
      <>
        <img
          className="w-full h-48 object-cover shadow-lg"
          src={nft?.image}
          alt={nft?.name}
        />
        <div className="flex justify-between items-center bg-gray-800 bg-opacity-50 p-2">
          <span className="text-white">{nft?.name}</span>
          <span className="text-white">N°{tokenId}</span>
        </div>
      </>
    )}
  </div>
);

const NFTCardSkeleton: React.FC = () => (
  <>
    <div className=" h-40 bg-gray-300 animate-pulse" />
    <div className="h-8 bg-gray-300 mt-2 animate-pulse" />
  </>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div
    className="absolute top-0 left-0 w-full flex justify-center items-center text-white text-center rounded-lg z-10 mt-40"
    style={{ textShadow: "0px 0px 20px #737373" }}
  >
    <h6 className="text-3xl">{message}</h6>
  </div>
);
