"use client";

import { createContext, useContext, useState } from "react";
import { Trade } from "@/types/trade";

type MarketContextType = {
  trades: Trade[];
  addTrade: (t: Trade) => void;
};

const MarketContext = createContext<MarketContextType | null>(null);

export default function MarketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [trades, setTrades] = useState<Trade[]>([]);

  const addTrade = (t: Trade) => {
    setTrades((prev) => [t, ...prev]);
  };

  return (
    <MarketContext.Provider value={{ trades, addTrade }}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("MarketProvider missing");
  return ctx;
};
