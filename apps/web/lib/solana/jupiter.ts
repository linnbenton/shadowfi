import { connection } from "./connection";

export async function getSwapRoute(
  inputMint: string,
  outputMint: string,
  amount: number,
) {
  const res = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`,
  );

  return res.json();
}
