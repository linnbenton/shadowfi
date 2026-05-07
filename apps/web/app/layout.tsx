import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import provider yang baru kita buat
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletContextProvider } from "../components/WalletContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShadowFi — Encrypted Cross-Chain Lending",
  description: "Private lending protocol powered by Encrypt and Ika",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Bungkus children dengan WalletContextProvider */}
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
