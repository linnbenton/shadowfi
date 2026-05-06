import { useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { runAgent } from "@/lib/agent/engine";

export default function AgentProvider() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const sendTransaction = wallet.sendTransaction;

  const inputMint = "So11111111111111111111111111111111111111112";
  const outputMint = "USDC";

  useEffect(() => {
    if (!connection || !wallet.connected) return;

    const interval = setInterval(() => {
      runAgent({
        connection,
        sendTransaction,
        inputMint,
        outputMint,
        amount: 1,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [connection, wallet.connected, sendTransaction]);

  return null;
}
