"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

// 🔥 RPC CONFIG (AUTO FALLBACK)
const endpoint =
  process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";

export default function WalletProviderRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔐 Wallet adapters (minimal & clean)
  const wallets = useMemo(() => {
    return [new PhantomWalletAdapter()];
  }, []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: "confirmed",

        // 🔥 REDUCE WS ERROR SPAM
        wsEndpoint: undefined,

        // 🔥 STABILITY
        disableRetryOnRateLimit: true,
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
