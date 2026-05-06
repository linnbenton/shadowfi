export type JupiterQuote = {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string; // ← ini yang kita butuh
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  routePlan: any[];
};
