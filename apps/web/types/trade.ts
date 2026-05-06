export type Trade = {
  mint: string;
  qty: number;
  price: number;
  side: "buy" | "sell";
  timestamp?: number;
};
