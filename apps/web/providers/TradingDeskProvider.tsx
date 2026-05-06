"use client";

import { createContext, useContext } from "react";
import { portfolio } from "@/lib/portfolio/portfolioEngine";
import { riskEngine } from "@/lib/risk/riskEngine";

const TradingContext = createContext<any>(null);

export default function TradingDeskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TradingContext.Provider value={{ portfolio, riskEngine }}>
      {children}
    </TradingContext.Provider>
  );
}

export const useTradingDesk = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error("TradingDesk missing");
  return ctx;
};
