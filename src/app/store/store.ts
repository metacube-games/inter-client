import { create } from "zustand";

interface GStore {
  isConnected: boolean;
  walletAddress: string;
  setIsConnected: (isConnected: boolean) => void;
  setWalletAddress: (address: string) => void;
}

export const useGStore = create<GStore>((set) => ({
  isConnected: false,
  walletAddress: "",
  setIsConnected: (isConnected) => set({ isConnected }),
  setWalletAddress: (walletAddress) => set({ walletAddress }),
}));
