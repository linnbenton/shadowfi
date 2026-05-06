"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export function useSendSolana() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = async (to: string, amount: number) => {
    if (!publicKey) throw new Error("Wallet not connected");

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );

    const signature = await sendTransaction(transaction, connection, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    await connection.confirmTransaction(signature, "confirmed");

    return signature;
  };

  return { sendSol };
}
