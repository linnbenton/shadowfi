"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { usePortfolio } from "@/providers/PortfolioProvider";

import Chart from "@/components/Chart";
import WalletMenu from "@/components/wallet/WalletMenu";
import Button from "@/components/ui/Button";

import { executeTradeCore } from "@/lib/execution/service";
import { runAgent } from "@/lib/agent/engine";

import {
  matchOrders,
  buildOrderbook,
  liquidityEngine,
  Order,
  Trade,
} from "@/lib/hftEngine";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

export default function MarketPage() {
  // =============================
  // WALLET
  // =============================
  const { connection } = useConnection();
  const wallet = useWallet();

  const { publicKey, connected, sendTransaction } = wallet;

  const { balance } = useSolanaBalance();

  // ✅ FIX: hook HARUS di atas
  const portfolio = usePortfolio();

  // =============================
  // STATE
  // =============================
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [demo] = useState(false);

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  // =============================
  // EXECUTE TRADE
  // =============================
  const handleTrade = async () => {
    if (!connected || !publicKey) return;

    // 🛡️ guard input
    if (!amount || amount <= 0) return;

    try {
      const lamports = Math.floor(amount * 1e9);

      const result = await executeTradeCore({
        connection,
        publicKey,
        sendTransaction,
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "USDC",
        amount: lamports,
      });

      console.log("EXECUTION:", result);
    } catch (err) {
      console.warn("Trade fail (safe):", err);
    }
  };

  // =============================
  // MATCH ENGINE
  // =============================
  useEffect(() => {
    const i = setInterval(() => {
      const buys = orders.filter((o) => o.side === "buy");
      const sells = orders.filter((o) => o.side === "sell");

      const fills = matchOrders(buys, sells);

      if (fills.length) {
        setTrades((p) => [...fills, ...p]);
      }
    }, 700);

    return () => clearInterval(i);
  }, [orders]);

  // =============================
  // AGENT
  // =============================
  useEffect(() => {
    if (!demo) return;

    const agent = setInterval(() => {
      runAgent({
        connection,
        sendTransaction,
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "USDC",
        amount: 1,
      });
    }, 5000);

    return () => clearInterval(agent);
  }, [demo, connection, sendTransaction]);

  // =============================
  // GUARD UI
  // =============================
  if (!connected || !publicKey) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <h1 className="text-3xl font-bold mb-4">🚀 ShadowMarket Locked</h1>

        <p className="text-cyan-300 mb-6">
          Please connect your wallet to continue
        </p>

        <WalletMenu />
      </div>
    );
  }

  // =============================
  // DERIVED
  // =============================
  const bidBook = buildOrderbook(orders.filter((o) => o.side === "buy"));
  const askBook = buildOrderbook(orders.filter((o) => o.side === "sell"));

  const liq = liquidityEngine(
    orders.filter((o) => o.side === "buy"),
    orders.filter((o) => o.side === "sell"),
  );

  // =============================
  // UI
  // =============================
  return (
    <main className="min-h-screen font-mono text-white relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.2),transparent_40%)] z-0" />

      <div className="relative z-10 p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold neon tracking-[0.35em]">
              SHADOWMARKET
            </h1>
            <p className="text-xs text-cyan-300/70 tracking-widest">
              HFT TERMINAL • MEV SHIELD • AI CORE
            </p>
          </div>

          <div className="panel px-4 py-2 rounded-lg text-right">
            <WalletMultiButton />

            <div className="text-[10px] mt-1 text-cyan-300">
              {publicKey.toBase58().slice(0, 6)}...
              {publicKey.toBase58().slice(-4)}
              <br />
              {balance?.toFixed(2)} SOL
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-4 h-[70vh]">
          {/* CHART */}
          <div className="col-span-2 panel p-3 flex flex-col">
            <div className="text-cyan-400 text-xs mb-2 neon">MARKET FEED</div>

            <div className="flex-1">
              <Chart trades={trades} />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col gap-4">
            {/* ORDERBOOK */}
            <div className="panel p-3 overflow-auto">
              <h2 className="text-xs mb-2">ORDERBOOK</h2>

              {bidBook.map((b, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{b.price}</span>
                  <span>{b.size}</span>
                </div>
              ))}

              {askBook.map((a, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{a.price}</span>
                  <span>{a.size}</span>
                </div>
              ))}
            </div>

            {/* TRADES */}
            <div className="panel p-3 h-[200px] overflow-hidden">
              <h2 className="text-xs mb-2">TRADES</h2>

              <AnimatePresence>
                {trades.slice(0, 20).map((t, i) => (
                  <motion.div
                    key={i}
                    className="text-xs text-white/70"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: i * 0.05,
                    }}
                  >
                    {t.qty} @ {t.price}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* AI PANEL */}
            <div className="panel p-3 text-xs">
              <div className="text-purple-400 neon">AI LIQUIDITY CORE</div>

              <div className="mt-2 text-cyan-300">
                SCORE: {liq.score.toFixed(4)}
              </div>

              <div className="text-gray-400">STATE: {liq.label}</div>
            </div>
          </div>
        </div>

        {/* PORTFOLIO */}
        <div className="panel p-3 text-xs">
          <div className="text-green-400">PORTFOLIO</div>
          <div className="mt-2">PnL: {portfolio.totalPnL.toFixed(4)}</div>
          <div>Exposure: {portfolio.exposure.toFixed(4)}</div>
        </div>

        {/* ORDER PANEL */}
        <div className="panel p-4 flex gap-2 items-center">
          <select
            className="bg-black/40 border p-2 text-xs"
            onChange={(e) => setSide(e.target.value as any)}
          >
            <option value="buy">BUY</option>
            <option value="sell">SELL</option>
          </select>

          <input
            className="bg-black/40 border p-2 text-xs"
            placeholder="AMOUNT"
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <input
            className="bg-black/40 border p-2 text-xs"
            placeholder="PRICE"
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <Button onClick={handleTrade} disabled={!amount || amount <= 0}>
            EXECUTE
          </Button>
        </div>
      </div>
    </main>
  );
}
