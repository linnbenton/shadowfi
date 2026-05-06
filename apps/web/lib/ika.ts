export function createDWallet(user: string) {
  return `dwallet_${user}_${Math.random().toString(36).slice(2, 8)}`;
}

export function depositAsset(asset: string, amount: number) {
  console.log(`Deposited ${amount} ${asset}`);
}
