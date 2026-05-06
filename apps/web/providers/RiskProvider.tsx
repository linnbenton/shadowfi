"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";

// 🎯 TYPE
type RiskConfig = {
  maxPosition: number;
};

type RiskContextType = {
  check: (amount: number) => boolean;
  config: RiskConfig;
};

// 🧠 ENGINE
class RiskEngine {
  config: RiskConfig;

  constructor(config: RiskConfig) {
    this.config = config;
  }

  check(amount: number, currentExposure: number = 0) {
    if (!amount || amount <= 0) return false;

    // limit posisi total
    if (amount > this.config.maxPosition) return false;

    // limit exposure total
    if (currentExposure + amount > this.config.maxPosition * 2) {
      return false;
    }

    return true;
  }
}

// 🔗 CONTEXT
const RiskContext = createContext<RiskContextType | null>(null);

// 🚀 PROVIDER
export default function RiskProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(() => {
    const config: RiskConfig = {
      maxPosition: 500, // 🔥 bisa kamu ubah nanti (dynamic)
    };

    const instance = new RiskEngine(config);

    return {
      check: instance.check.bind(instance),
      config,
    };
  }, []);

  return <RiskContext.Provider value={engine}>{children}</RiskContext.Provider>;
}

// 🪝 HOOK
export const useRisk = () => {
  const ctx = useContext(RiskContext);

  if (!ctx) {
    throw new Error("RiskProvider missing");
  }

  return ctx;
};
