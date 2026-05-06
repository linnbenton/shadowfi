import { Transaction } from "@solana/web3.js";

export async function buildTradeTx(instruction: any, payer: any) {
  const tx = new Transaction().add(instruction);
  tx.feePayer = payer;
  return tx;
}
