/**
 * SHADOWFI - ENCRYPT LIB
 * Built for Encrypt & Ika Frontier Hackathon
 * Documentation: https://docs.encrypt.xyz/
 */

export function encrypt(data: any): string {
  // Simulasi REFHE (Fully Homomorphic Encryption)
  const jsonStr = JSON.stringify({
    ...data,
    encryptedAt: new Date().toISOString(),
    network: "Solana-Devnet-REFHE",
  });

  // Menggunakan prefix 'fhet' untuk menandakan FHE Token
  return `fhet_0x${btoa(jsonStr).substring(0, 48)}...${btoa(jsonStr).slice(-12)}`;
}

export function decrypt(cipher: string): any {
  try {
    const raw = cipher.replace("fhet_0x", "").split("...")[0];
    return JSON.parse(atob(raw));
  } catch (e) {
    return { collateral: 0, debt: 1 };
  }
}

export function computeHealth(cipher: string): number {
  const data = decrypt(cipher);
  if (!data.collateral || data.collateral === 0) return 0;

  // Simulasi fluktuasi harga pasar real-time
  const volatility = 0.9 + Math.random() * 0.2;
  return (data.collateral * volatility) / (data.debt || 1);
}

export function getStatus(health: number): string {
  if (health >= 2.0) return "SAFE";
  if (health >= 1.2) return "RISKY";
  return "LIQUIDATABLE";
}
