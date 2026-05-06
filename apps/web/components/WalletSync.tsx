"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletStore } from "@/store/useWalletStore";

export default function WalletSync() {
  const wallet = useWallet();
  const setWallet = useWalletStore((s) => s.setWallet);

  useEffect(() => {
    setWallet({
      connected: wallet.connected,
      publicKey: wallet.publicKey,
    });
  }, [wallet.connected, wallet.publicKey]);

  return null;
}
