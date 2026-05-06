import { Trade } from "@/types/trade";

type Position = {
  mint: string;
  qty: number;
  avgPrice: number;
  pnl: number;
};

export class PortfolioEngine {
  positions: Record<string, Position> = {};

  applyTrade(trade: Trade) {
    const { mint, qty, price, side } = trade;

    const signedQty = side === "buy" ? qty : -qty;

    const current = this.positions[mint] || {
      mint,
      qty: 0,
      avgPrice: 0,
      pnl: 0,
    };

    const newQty = current.qty + signedQty;

    // weighted average price
    const newAvg =
      newQty === 0
        ? 0
        : (current.avgPrice * current.qty + price * signedQty) / newQty;

    const pnl = (price - newAvg) * newQty;

    this.positions[mint] = {
      mint,
      qty: newQty,
      avgPrice: newAvg,
      pnl,
    };
  }

  getPositions() {
    return Object.values(this.positions);
  }

  getTotalPnL() {
    return this.getPositions().reduce((acc, p) => acc + p.pnl, 0);
  }

  getExposure() {
    return this.getPositions().reduce(
      (acc, p) => acc + Math.abs(p.qty * p.avgPrice),
      0,
    );
  }
}

// singleton (global)
export const portfolio = new PortfolioEngine();
