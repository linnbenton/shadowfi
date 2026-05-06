import { executeTrade } from "@/lib/execution/jupiterSwap";

export async function executionEngine(params: any) {
  const result = await executeTrade(params);

  return {
    ok: true,
    signature: result.signature,
    route: result.quote,
  };
}
