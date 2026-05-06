import { PublicKey } from "@solana/web3.js";
import { connection } from "./connection";

// SIMPLIFIED DEVNET ENGINE (v1)
export async function buildSwapInstruction({
  side,
  amount,
  price,
  user,
}: {
  side: "buy" | "sell";
  amount: number;
  price: number;
  user: PublicKey;
}) {
  // placeholder logic dulu (Jupiter nanti v2)
  return {
    programId: new PublicKey("11111111111111111111111111111111"),
    keys: [],
    data: Buffer.from(
      JSON.stringify({ side, amount, price, user: user.toBase58() }),
    ),
  };
}
