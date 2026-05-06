export function routeTrade(input: { amount: number; slippage: number }) {
  if (input.amount > 1000) {
    return "JUPITER_AGGREGATED";
  }

  if (input.slippage > 1) {
    return "MEV_PROTECTED_ROUTE";
  }

  return "DIRECT_SWAP";
}
