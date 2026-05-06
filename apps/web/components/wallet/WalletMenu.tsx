"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function WalletMenu() {
  const { publicKey, disconnect } = useWallet();
  const [open, setOpen] = useState(false);

  if (!publicKey) return null;

  const address = publicKey.toBase58();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-purple-600 px-3 py-2 rounded text-white text-xs"
      >
        {address.slice(0, 4)}...{address.slice(-4)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-black border text-xs rounded shadow-lg">
          <button
            onClick={() => {
              navigator.clipboard.writeText(address);
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 hover:bg-white/10"
          >
            Copy Address
          </button>

          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-red-400 hover:bg-white/10"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
