"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import WalletInfo from "@/components/wallet/WalletInfo";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center text-white">
      <div className="flex flex-col items-center gap-6">
        {/* WALLET BUTTON */}
        <div className="mb-2">
          <WalletMultiButton />
        </div>

        {/* CARD */}
        <div className="border border-cyan-400 p-6 w-[420px] rounded-lg">
          <WalletInfo />
        </div>

        {/* LINK */}
        <Link
          href="/market"
          className="!text-yellow-400 hover:!text-white !no-underline font-semibold mt-2 cursor-pointer tracking-widest"
        >
          GO TO MARKET
        </Link>
      </div>
    </main>
  );
}
