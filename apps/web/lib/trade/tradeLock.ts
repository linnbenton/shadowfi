let lastTradeTime = 0;
const COOLDOWN_MS = 3000;

export function canExecuteTrade() {
  const now = Date.now();

  if (now - lastTradeTime < COOLDOWN_MS) {
    return false;
  }

  lastTradeTime = now;
  return true;
}
