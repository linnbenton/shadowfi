import { PublicKey } from "@solana/web3.js";

export async function requireWallet(wallet: { publicKey: PublicKey | null }) {
  if (!wallet.publicKey) return null;
  return wallet.publicKey;
}
