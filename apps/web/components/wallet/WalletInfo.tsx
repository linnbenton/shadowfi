"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";

export default function WalletInfo() {
  const { publicKey, connected } = useWallet();
  const { balance, loading, refresh } = useSolanaBalance();

  if (!connected || !publicKey) {
    return (
      <div className="text-white flex items-center justify-center h-screen">
        Connect wallet first
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl mt-4">
      <p className="text-sm text-gray-400">Address</p>
      <p className="break-all">{publicKey?.toBase58()}</p>

      <p className="mt-2 text-sm text-gray-400">Balance</p>
      <p className="text-xl font-bold">
        {loading ? "Loading..." : `${balance ?? 0} SOL`}
      </p>

      <button
        onClick={refresh}
        className="mt-3 px-4 py-2 bg-white text-black rounded"
      >
        Refresh
      </button>
    </div>
  );
}
