export function createDWallet(user: string): string {
  return "dwallet_" + user;
}

export function depositAsset(asset: string, amount: number) {
  console.log(`Deposited ${amount} ${asset}`);
}
