"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getAllStatistics } from "@/app/backendAPI/backendAPI";
import { useAuthStore } from "@/app/store/authStore";
// import { getAllStatistics } from "@/app/backendAPI/backendAPI";
interface IUserStats {
  cubes: number;
  username: string;
  deaths: number;
  joined: string;
  totalCoins: number;
  nfts?: number;
  id?: string;
  rank?: number;
}

const COLUMNS = [
  { key: "rank", title: "Rank", width: "w-16" },
  { key: "username", title: "Username", width: "w-48" },
  { key: "id", title: "ID", width: "w-32" },
  { key: "cubes", title: "Cubes", width: "w-24" },
  { key: "totalCoins", title: "Coins", width: "w-24" },
  { key: "deaths", title: "Deaths", width: "w-24" },
  { key: "nfts", title: "NFTs", width: "w-24" },
];

export function StatsPanel() {
  const [, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [playerStats, setPlayerStats] = useState<IUserStats[]>([]);

  useEffect(() => {
    const getStats = async () => {
      const players = (await getAllStatistics()) as any;
      const playersArray = Object.entries(players.statistics).map(
        ([id, player]) => ({ ...(player as IUserStats), id })
      );
      playersArray.forEach((player) => {
        player.rank =
          (player.nfts ?? 0) * 10000 +
          (player.cubes ?? 0) * 50 +
          (player.totalCoins ?? 0);
      });
      playersArray.sort((a, b) => Number(b.rank) - Number(a.rank));
      playersArray.forEach((player, index) => {
        player.rank = index + 1;
      });
      setPlayerStats(playersArray);
    };
    getStats();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchTerm(event.target.value);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-green-400 bg-black text-green-400 rounded"
          placeholder="Search player"
        />
      </div>
      <StatsTable playerStats={playerStats} searchTerm={searchTerm} />
    </div>
  );
}

function StatsTable({
  playerStats,
  searchTerm,
}: {
  playerStats: IUserStats[];
  searchTerm: string;
}) {
  const walletAddress = ""; //useAuthStore((state) => state.walletAddress);
  const [mergedStats, setMergedStats] = useState<IUserStats[]>([]);

  useEffect(() => {
    if (!playerStats?.length) return;
    if (!walletAddress || walletAddress.length <= 0 || searchTerm.length > 0) {
      setMergedStats(playerStats);
      return;
    }
    const walletAddressFormatted = "0" + walletAddress?.slice(2);
    const index = playerStats.findIndex(
      (player) => player.id === walletAddressFormatted
    );
    const stats = playerStats[index];
    if (stats) {
      stats.rank = index + 1;
      setMergedStats([stats, ...playerStats]);
    }
  }, [walletAddress, playerStats, searchTerm]);

  const filteredPlayers = mergedStats.filter(
    (player) =>
      player?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredPlayers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  return (
    <div className="w-full bg-black border border-green-400 rounded shadow-lg p-4 flex-grow overflow-auto custom-scrollbar">
      <div className="min-w-max  bg-black z-10 ">
        <div className="flex w-full mb-2 sticky top-0 bg-black z-10 pb-2 shadow-[0_-40px_60px_40px_rgb(0,0,0)]">
          {COLUMNS.map(({ title, width }) => (
            <div key={title} className={`${width} px-2 text-left bg-black `}>
              <span className="text-green-400 text-sm font-bold">{title}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-green-400 w-full mb-2 sticky top-8 z-10" />
        <div
          ref={parentRef}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <PlayerRow
              key={virtualRow.index}
              player={filteredPlayers[virtualRow.index]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  style,
}: {
  player: IUserStats;
  style: React.CSSProperties;
}) {
  const pID = player?.id
    ? `${player.id.substring(0, 3)}...${player.id.slice(-3)}`
    : "";

  return (
    <div style={style} className="flex items-center w-full py-1">
      {COLUMNS.map(({ key, width }) => (
        <div
          key={key}
          className={`${width} px-2 overflow-hidden text-ellipsis text-left`}
        >
          <span className="text-green-400 text-sm">
            {key === "id" ? pID : player[key as keyof IUserStats]}
          </span>
        </div>
      ))}
    </div>
  );
}
