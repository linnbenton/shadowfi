"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function useSolanaBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!publicKey || !connected) return;

    let subId: number;

    // 🔥 1. initial fetch
    connection
      .getBalance(publicKey)
      .then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      })
      .catch(() => setBalance(0));

    // 🔥 2. realtime update (SUPER IMPORTANT)
    subId = connection.onAccountChange(publicKey, (acc) => {
      setBalance(acc.lamports / LAMPORTS_PER_SOL);
    });

    return () => {
      if (subId) connection.removeAccountChangeListener(subId);
    };
  }, [publicKey, connection, connected]);

  return { balance };
}
