"use client";

import { createContext, useContext, useState } from "react";
import { portfolio } from "@/lib/portfolio/portfolioEngine";
import { Trade } from "@/types/trade";

type PortfolioContextType = {
  positions: any[];
  totalPnL: number;
  exposure: number;
  applyTrade: (trade: Trade) => void;
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export default function PortfolioProvider({ children }: any) {
  const [, forceUpdate] = useState(0);

  const applyTrade = (trade: Trade) => {
    portfolio.applyTrade(trade);

    // trigger re-render
    forceUpdate((p) => p + 1);
  };

  return (
    <PortfolioContext.Provider
      value={{
        positions: portfolio.getPositions(),
        totalPnL: portfolio.getTotalPnL(),
        exposure: portfolio.getExposure(),
        applyTrade,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("PortfolioProvider missing");
  return ctx;
};
