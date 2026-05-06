import { WalletContextState } from "@solana/wallet-adapter-react";

export async function autoConnect(wallet: WalletContextState) {
  try {
    if (wallet.connected || wallet.connecting) return true;

    if (wallet.wallet && wallet.connect) {
      await wallet.connect();
      return true;
    }

    return false;
  } catch (err) {
    console.warn("Auto connect failed:", err);
    return false;
  }
}
