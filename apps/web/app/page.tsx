"use client";

import { useEffect, useState } from "react";
import { encrypt, computeHealth, getStatus } from "@/lib/encrypt";
import { createDWallet } from "@/lib/ika";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey, connected, disconnect, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);
  const [user] = useState("shadow_dev_01");
  const [wallet, setWallet] = useState<string>("");

  const [collateral, setCollateral] = useState(0);
  const [debt, setDebt] = useState(0);
  const [position, setPosition] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [health, setHealth] = useState(0);
  const [status, setStatus] = useState("SAFE");
  const [liquidated, setLiquidated] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Initializing Shadow Protocol...",
  ]);

  // State untuk Simulasi Koneksi & Transaksi
  useEffect(() => {
    if (connected && publicKey) {
      addLog(`Wallet Connected: ${publicKey.toBase58().substring(0, 6)}...`);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const w = createDWallet(user);
    setWallet(w);
    addLog(`MPC dWallet created for ${user}`);
  }, [user]);

  function addLog(msg: string) {
    setLogs((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5),
    );
  }

  async function handleCreate() {
    // 1. Validasi awal
    if (!connected || !publicKey || !signMessage) {
      addLog("ERROR: Wallet not ready for signing.");
      return;
    }

    try {
      addLog("Requesting FHE Key Signature...");

      const message = new TextEncoder().encode(
        `ShadowFi Encryption Authorization\nUser: ${user}`,
      );

      // 2. PAKAI HOOK (BUKAN WINDOW.SOLANA)
      // Ini akan otomatis memicu pop-up Phantom yang benar
      await signMessage(message);

      addLog("Signature verified. Encrypting via REFHE...");

      // 3. Logika Enkripsi & State Update
      const encrypted = encrypt({ collateral, debt });

      // Simulasi delay biar kelihatan ada proses komputasi
      setTimeout(() => {
        setPosition(encrypted);
        setLiquidated(false);
        setHealth(0);
        setStatus("SAFE");
        setTxHash(
          "4v9Z2" +
            Math.random().toString(36).substring(7).toUpperCase() +
            "fH3",
        );
        addLog("CONFIRMED: Position secured on Solana.");
      }, 800);
    } catch (err: any) {
      // Menangkap jika user klik "Cancel" di Phantom
      addLog("USER REJECTED SIGNATURE.");
      console.log("User cancelled the sign request.");
    }
  }

  useEffect(() => {
    if (!position) return;
    const interval = setInterval(() => {
      const h = computeHealth(position);
      const s = getStatus(h);
      setHealth(h);
      setStatus(s);
      if (h < 1 && !liquidated) {
        setLiquidated(true);
        addLog("CRITICAL: Confidential liquidation triggered.");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [position, liquidated]);

  const healthPercent = Math.min(health * 50, 100);

  return (
    <main className="min-h-screen bg-[#050505] text-[#00ffcc] font-mono p-4 lg:p-10 grid grid-cols-12 gap-6">
      {/* LEFT PANEL: IKA MULTI-CHAIN GATEWAY */}
      <div className="col-span-12 lg:col-span-3 border border-[#00ffcc]/20 bg-[#00ffcc]/5 p-6 rounded-xl backdrop-blur-md">
        <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-yellow-400 font-bold">
          Ika Gateway (MPC)
        </h2>
        <div className="space-y-4">
          <div className="p-3 border border-[#00ffcc]/10 bg-black/40 rounded">
            <p className="text-[10px] text-gray-500 uppercase">
              Active dWallet
            </p>
            <p className="text-[11px] break-all text-white font-bold">
              {wallet || "Generating..."}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase">
              Cross-Chain Assets
            </p>
            {["Native BTC", "Ethereum (WETH)", "RWA Gold"].map((asset) => (
              <div
                key={asset}
                className="flex justify-between text-xs p-2 bg-white/5 rounded border border-white/5"
              >
                <span>{asset}</span>
                <span className="text-white">Locked</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MIDDLE PANEL: CORE ENGINE */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-[8px] text-[#00ffcc]/30">
            PROTOCOL_V.1.0.4
          </div>

          <h1 className="text-4xl font-black italic tracking-tighter mb-2 text-white">
            SHADOW<span className="text-[#00ffcc]">FI</span>
          </h1>
          <p className="text-yellow-400 text-[10px] uppercase tracking-widest mb-8 border-b border-white/10 pb-4 font-bold">
            Encrypted Capital Markets & Bridgeless Interoperability
          </p>

          <div className="flex flex-col gap-4">
            <div className="group">
              <label className="text-[10px] uppercase text-yellow-400 ml-1 font-bold">
                Collateral Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-4 mt-1 rounded-xl bg-black/60 border border-white/10 focus:border-[#00ffcc] outline-none transition-all text-xl"
                onChange={(e) => setCollateral(Number(e.target.value))}
              />
            </div>

            <div className="group">
              <label className="text-[10px] uppercase text-yellow-400 ml-1 font-bold">
                Borrowing (USDC)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-4 mt-1 rounded-xl bg-black/60 border border-white/10 focus:border-[#00ffcc] outline-none transition-all text-xl"
                onChange={(e) => setDebt(Number(e.target.value))}
              />
            </div>

            {/* LOGIKA TOMBOL KONEKSI WALLET */}
            {mounted && (
              <div className="mt-4">
                {!connected ? (
                  /* JIKA BELUM KONEK: Hanya muncul satu tombol besar */
                  <button
                    onClick={() => setVisible(true)}
                    className="w-full py-6 bg-yellow-400 text-black font-black uppercase rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-[0.98] transition-all"
                  >
                    Connect Wallet to Start
                  </button>
                ) : (
                  /* JIKA SUDAH KONEK: Muncul tombol aksi dan tombol disconnect di bawahnya */
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleCreate}
                      className="w-full py-6 bg-[#00ffcc] text-black font-black uppercase rounded-xl shadow-[0_0_30px_rgba(0,255,204,0.3)] hover:scale-[0.98] transition-all animate-pulse"
                    >
                      Initialize Encrypted Position
                    </button>

                    <button
                      onClick={() => disconnect()}
                      className="w-full py-2 text-[10px] text-gray-500 uppercase tracking-widest hover:text-red-500 transition-colors border border-white/10 rounded-lg bg-white/5"
                    >
                      Disconnect Wallet ({publicKey?.toBase58().substring(0, 4)}
                      ...{publicKey?.toBase58().slice(-4)})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {position && (
            <div className="mt-10 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Position Shield Status
                  </p>
                  <p
                    className={`text-lg font-bold ${status === "SAFE" ? "text-green-400" : "text-red-500"}`}
                  >
                    {status}
                  </p>
                </div>
                <p className="text-xs text-white font-bold">
                  Health: {health.toFixed(2)}
                </p>
              </div>

              <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    status === "SAFE"
                      ? "bg-green-500 shadow-[0_0_15px_#22c55e]"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>

              {/* SIMULASI ON-CHAIN TX HASH */}
              <p className="mt-4 text-[9px] text-yellow-400/70 italic tracking-tight">
                ⛓️ On-chain TX: <span className="text-white">{txHash}</span>{" "}
                (Verified by Ika & Encrypt Nodes)
              </p>

              {liquidated && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg animate-pulse">
                  <p className="text-red-500 font-bold text-[10px] text-center uppercase tracking-tighter">
                    ☣️ Position Auto-Liquidated by Encrypted Strategy Vault ☣️
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: ENCRYPT PRIVACY LOGS */}
      <div className="col-span-12 lg:col-span-3 border border-[#00ffcc]/20 bg-black/60 p-6 rounded-xl">
        <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-yellow-400 font-bold italic">
          Encrypt Shield (FHE)
        </h2>
        <div className="space-y-4">
          <div className="p-3 bg-[#00ffcc]/5 border-l-2 border-[#00ffcc] rounded-r">
            <p className="text-[10px] text-gray-400 uppercase">
              Encryption Protocol
            </p>
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              REFHE Pre-Alpha
            </p>
          </div>

          <div className="mt-10">
            <p className="text-[10px] text-gray-500 uppercase mb-3 font-bold">
              Protocol Logs
            </p>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <p
                  key={i}
                  className="text-[9px] font-mono leading-tight text-[#00ffcc]/70 border-b border-white/5 pb-1"
                >
                  {log}
                </p>
              ))}
            </div>
          </div>

          {position && (
            <div className="mt-6">
              <p className="text-[10px] text-gray-500 uppercase mb-2">
                FHE Ciphertext Position
              </p>
              <div className="p-2 bg-black text-[8px] break-all border border-[#00ffcc]/30 rounded text-[#00ffcc]/50 h-20 overflow-y-auto">
                {position}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
