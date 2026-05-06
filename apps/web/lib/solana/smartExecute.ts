import { connection } from "./connection";
import { getSwapRoute } from "./jupiter";
import { chooseBestRoute } from "./router";
import { scoreMevRisk } from "./mev";

export async function smartExecute({
  inputMint,
  outputMint,
  amount,
}: {
  inputMint: string;
  outputMint: string;
  amount: number;
}) {
  // 1. get routes (Jupiter)
  const quote = await getSwapRoute(inputMint, outputMint, amount);

  const routes = quote?.data || [];

  // 2. choose best route (smart routing)
  const bestRoute = chooseBestRoute(
    routes.map((r: any) => ({
      path: r.routePlan,
      impact: r.priceImpactPct,
      priceOut: r.outAmount,
    })),
  );

  // 3. MEV risk scoring
  const mev = scoreMevRisk({
    amount,
    liquidityDepth: 100000, // placeholder (nanti dari on-chain)
    volatility: 0.3,
  });

  return {
    route: bestRoute,
    mev,
  };
}
