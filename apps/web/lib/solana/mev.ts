export function scoreMevRisk(params: {
  amount: number;
  liquidityDepth: number;
  volatility: number;
}) {
  const { amount, liquidityDepth, volatility } = params;

  const impact = amount / liquidityDepth;
  const risk = impact * volatility;

  return {
    score: risk,
    label: risk < 0.2 ? "LOW" : risk < 0.5 ? "MEDIUM" : "HIGH",
  };
}
