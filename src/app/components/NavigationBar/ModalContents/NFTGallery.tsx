import React, { useState, useEffect, useCallback } from "react";
import { RpcProvider, Contract } from "starknet";
// import { getRewardAddress } from "../../../API/backendAPI";
import { useAuthStore } from "@/app/store/authStore";
import { getRewardAddress } from "@/app/backendAPI/backendAPI";

const MGenesisAddress =
  "0x007ca74fd0a9239678cc6355e38ac1e7820141501727ae37f9c733e5ed1c3592";
const MGPASSCARD =
  "0x0602c301f6a1c2ef174bafaab7389c3f6165df34736befcf2ca3df7764934caf";

let provider: RpcProvider | undefined = undefined;
let metacubeContract: Contract | undefined = undefined;
let metacubePSContract: Contract | undefined = undefined;

const generateProvider = async () => {
  if (provider) return;
  provider = new RpcProvider({
    nodeUrl: "https://starknet-mainnet.public.blastapi.io/rpc/v0_7",
  });
  const metacubeRootAbi = await provider.getClassAt(MGenesisAddress);
  metacubeContract = new Contract(
    metacubeRootAbi.abi,
    MGenesisAddress,
    provider
  );
  metacubePSContract = new Contract(metacubeRootAbi.abi, MGPASSCARD, provider);
};
generateProvider();

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

export const NFTGallery: React.FC = () => {
  const isLogin = useAuthStore((state) => state.isConnected);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewardAddress, setRewardAddress] = useState("");
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  const fetchNFTs = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const rewardAddress = await getRewardAddress();
      console.log(rewardAddress);
      const fRewardAddress = `0x${rewardAddress?.address}`;
      // "0x029aaeff147fcdd9fedecb94a6cf20c55022d7f8df66df4e9a8da4f0c7483261"; //
      setRewardAddress(fRewardAddress);

      if (fRewardAddress.length < 5 || !isLogin) {
        setLoading(false);
        return;
      }

      const totGNFTS = Number(
        await metacubeContract?.call("balanceOf", [fRewardAddress])
      );
      const totPSNFTS = Number(
        await metacubePSContract?.call("balanceOf", [fRewardAddress])
      );
      const totalNFTs = totGNFTS + totPSNFTS;

      if (totalNFTs === 0) {
        setNfts([]);
        setLoading(false);
        return;
      }

      const genesisIds = Array.from({ length: totGNFTS }, (_, index) => index);
      const passIds = Array.from({ length: totPSNFTS }, (_, index) => index);

      const nftGenesis = genesisIds.map(() => ({
        animation_url: "https://felts.xyz/a/v.mp4",
        image: "https://felts.xyz/a/g.gif",
        name: "Genesis",
      }));

      const nftPass = passIds.map(() => ({
        animation_url: "https://felts.xyz/a/p.mp4",
        image: "https://felts.xyz/a/p.gif",
        name: "Passcard",
      }));

      const nftDetails = [...nftGenesis, ...nftPass];
      setNfts(nftDetails);
      setTokenIds([...genesisIds, ...passIds]);
    } catch (err) {
      setError("Failed to fetch NFTs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  if (error) {
    return (
      <p className="text-red-500 text-center">
        Oops! We couldn't load the NFTs. Please try again in a moment.
      </p>
    );
  }

  if (!isLogin) {
    return (
      <div className="h-[700px] flex items-center justify-center">
        <p className="text-white text-2xl text-center">
          Login to see your NFTs
        </p>
      </div>
    );
  }

  if (isLogin && rewardAddress?.length < 5) {
    return (
      <div className="h-[700px] flex items-center justify-center">
        <p className="text-white text-2xl text-center">
          You need to link a wallet to see your NFTs
        </p>
      </div>
    );
  }

  if (nfts.length === 0 && !loading) {
    return (
      <div className="h-[700px] flex items-center justify-center">
        <p className="text-white text-2xl text-center">
          Hey soldier, keep mining to get your first NFT!
        </p>
      </div>
    );
  }

  return <NFTGrid nfts={nfts} loading={loading} tokenIds={tokenIds} />;
};

const NFTGrid: React.FC<{
  nfts: NFTData[];
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
  nft: NFTData | null;
  loading: boolean;
  tokenId?: number;
}> = ({ nft, loading, tokenId }) => (
  <div className="w-full aspect-auto rounded-lg shadow-md overflow-hidden">
    {loading ? (
      <div className="w-f$ h-48 flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-900"></div>
      </div>
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
