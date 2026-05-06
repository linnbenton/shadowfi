"use client";

import WalletProviderRoot from "./WalletProvider";
import PortfolioProvider from "./PortfolioProvider";
import ExecutionProvider from "./ExecutionProvider";
import RiskProvider from "./RiskProvider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProviderRoot>
      <RiskProvider>
        <PortfolioProvider>
          <ExecutionProvider>{children}</ExecutionProvider>
        </PortfolioProvider>
      </RiskProvider>
    </WalletProviderRoot>
  );
}
