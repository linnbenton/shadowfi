"use client";

import { useEffect, useState } from "react";
import { encrypt, computeHealth, getStatus } from "@/lib/encrypt";
import { createDWallet } from "@/lib/ika";

export default function Home() {
  const [user] = useState("user1");
  const [wallet, setWallet] = useState<string>("");

  const [collateral, setCollateral] = useState(0);
  const [debt, setDebt] = useState(0);
  const [position, setPosition] = useState<string | null>(null);

  const [health, setHealth] = useState(0);
  const [status, setStatus] = useState("SAFE");
  const [liquidated, setLiquidated] = useState(false);

  // create dWallet (Ika feel)
  useEffect(() => {
    const w = createDWallet(user);
    setWallet(w);
  }, [user]);

  function handleCreate() {
    const data = { collateral, debt };
    const encrypted = encrypt(data);

    setPosition(encrypted);
    setLiquidated(false);

    setHealth(0);
    setStatus("SAFE");
  }

  // 🤖 AUTO LIQUIDATION LOOP
  useEffect(() => {
    if (!position) return;

    const interval = setInterval(() => {
      const h = computeHealth(position);
      const s = getStatus(h);

      setHealth(h);
      setStatus(s);

      if (h < 1) {
        setLiquidated(true);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [position]);

  // 🎨 health bar %
  const healthPercent = Math.min(health * 50, 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-10 flex justify-center">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          ShadowFi — Private Lending Engine
        </h1>
        <p className="text-gray-500 text-xs mb-4">
          Encrypted positions. Hidden liquidations. Institutional-grade DeFi.
        </p>

        <p className="text-gray-500 text-xs mb-6">
          dWallet: <span className="text-white">{wallet}</span>
        </p>

        {/* INPUT */}
        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Collateral"
            className="p-3 rounded-lg bg-black/50 border border-white/10"
            onChange={(e) => setCollateral(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Borrow Amount"
            className="p-3 rounded-lg bg-black/50 border border-white/10"
            onChange={(e) => setDebt(Number(e.target.value))}
          />

          <button
            onClick={handleCreate}
            className="bg-white text-black p-3 rounded-lg font-semibold hover:opacity-80 transition"
          >
            Create Position
          </button>
        </div>

        {/* RESULT */}
        {position && (
          <div className="mt-6">
            <p className="text-gray-500 text-xs mb-1">Encrypted Position</p>
            <p className="break-all text-xs bg-black/40 p-2 rounded">
              {position}
            </p>

            {/* HEALTH */}
            <div className="mt-5">
              <p className="text-sm">
                Health Factor:{" "}
                <span className="font-bold">{health.toFixed(2)}</span>
              </p>

              <div className="w-full h-2 bg-gray-800 rounded mt-2">
                <div
                  className={`h-2 rounded transition-all duration-500 ${
                    status === "SAFE"
                      ? "bg-green-500 shadow-[0_0_10px_#22c55e]"
                      : status === "RISKY"
                        ? "bg-yellow-400 shadow-[0_0_10px_#facc15]"
                        : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                  }`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
            </div>

            {/* STATUS */}
            <p className="mt-3 text-sm">
              Status:{" "}
              <span
                className={`font-bold ${
                  status === "SAFE"
                    ? "text-green-400"
                    : status === "RISKY"
                      ? "text-yellow-400"
                      : "text-red-500"
                }`}
              >
                {status}
              </span>
            </p>

            {/* LIQUIDATION */}
            {liquidated && (
              <div className="mt-4 p-3 bg-red-900/40 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-bold text-sm">
                  ⚠️ Auto Liquidated by Shadow Engine
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
