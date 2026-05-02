export function encrypt(data: any): string {
  return btoa(JSON.stringify(data));
}

export function decrypt(cipher: string): any {
  return JSON.parse(atob(cipher));
}

export function computeHealth(cipher: string): number {
  const data = decrypt(cipher);
  return data.collateral / (data.debt || 1);
}

export function getStatus(health: number): string {
  if (health >= 1.5) return "SAFE";
  if (health >= 1.0) return "RISKY";
  return "LIQUIDATABLE";
}
