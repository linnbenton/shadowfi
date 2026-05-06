import { create } from "zustand";
import { PublicKey } from "@solana/web3.js";

type WalletState = {
  connected: boolean;
  publicKey: PublicKey | null;
  setWallet: (data: {
    connected: boolean;
    publicKey: PublicKey | null;
  }) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  connected: false,
  publicKey: null,
  setWallet: (data) => set(data),
}));
