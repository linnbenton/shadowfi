"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletButton() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
      <WalletMultiButton />
    </div>
  );
}
