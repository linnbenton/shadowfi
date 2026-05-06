"use client";

import { createContext, useContext } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { executeTrade } from "@/lib/execution/executor";
import { useRisk } from "./RiskProvider";
import { usePortfolio } from "./PortfolioProvider";
import { routeTrade } from "@/lib/routing/router";
import { detectMevRisk } from "@/lib/mev/mevEngine";
import { ExecuteTradeResult } from "@/types/execution";

type ExecuteParams = {
  inputMint: string;
  outputMint: string;
  amount: number;
};

type ExecutionContextType = {
  execute: (params: ExecuteParams) => Promise<ExecuteTradeResult>;
};

const ExecutionContext = createContext<ExecutionContextType | null>(null);

export default function ExecutionProvider({ children }: any) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const risk = useRisk();
  const portfolio = usePortfolio();

  const execute = async (params: ExecuteParams) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    if (!params.amount || params.amount <= 0) {
      throw new Error("Invalid amount");
    }

    // 🛡️ Risk
    if (!risk.check(params.amount)) {
      throw new Error("RISK_LIMIT_EXCEEDED");
    }

    // 🧭 Routing
    const route = routeTrade({
      amount: params.amount,
      slippage: 0.5,
    });

    // 🧠 MEV
    const mev = detectMevRisk({
      amount: params.amount,
      volatility: 0.3,
    });

    // 🚀 Execute
    const result = (await executeTrade({
      connection,
      publicKey,
      sendTransaction,
      ...params,
    })) as ExecuteTradeResult;

    // 💰 PRICE CALC (SAFE)
    const outAmount = result.outAmount ?? 0;

    const price =
      params.amount > 0 ? Number(outAmount) / Number(params.amount) : 0;

    console.log("OUT AMOUNT:", outAmount);
    console.log("PRICE:", price);

    // 📊 Portfolio update
    portfolio.applyTrade({
      mint: params.outputMint,
      price,
      qty: params.amount,
      side: "buy",
    });

    return {
      ...result,
      route,
      mev,
    };
  };

  return (
    <ExecutionContext.Provider value={{ execute }}>
      {children}
    </ExecutionContext.Provider>
  );
}

export const useExecution = () => {
  const ctx = useContext(ExecutionContext);
  if (!ctx) throw new Error("ExecutionProvider missing");
  return ctx;
};
