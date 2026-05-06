class RiskEngine {
  maxPosition = 1000;
  maxTrade = 100;

  checkTrade(amount: number) {
    if (amount > this.maxTrade) {
      throw new Error("TRADE_LIMIT_EXCEEDED");
    }
  }

  checkExposure(current: number) {
    if (current > this.maxPosition) {
      throw new Error("EXPOSURE_LIMIT_EXCEEDED");
    }
  }
}

export const riskEngine = new RiskEngine();
