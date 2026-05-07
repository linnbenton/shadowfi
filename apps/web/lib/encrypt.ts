/**
 * SHADOWFI - ENCRYPT LIB
 * Built for Encrypt & Ika Frontier Hackathon
 * Documentation: https://docs.encrypt.xyz/
 */

export function encrypt(data: any): string {
  // Kita simpan data lengkap di dalam Base64 tanpa dipotong
  const jsonStr = JSON.stringify({
    ...data,
    encryptedAt: new Date().toISOString(),
    network: "Solana-Devnet-REFHE",
  });

  const base64 = btoa(jsonStr);

  // Kita tambahkan prefix dan suffix HANYA untuk tampilan UI
  // Tapi data aslinya tetap ada di tengah supaya bisa di-decrypt
  return `fhet_0x${base64}`;
}

export function decrypt(cipher: string): any {
  try {
    // Kita hapus prefix 'fhet_0x' untuk mendapatkan Base64 aslinya
    const rawBase64 = cipher.replace("fhet_0x", "");
    const decoded = atob(rawBase64);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Decryption failed:", e);
    return { collateral: 0, debt: 1 };
  }
}

export function computeHealth(cipher: string): number {
  const data = decrypt(cipher);
  const col = Number(data.collateral) || 0;
  const deb = Number(data.debt) || 1;

  // Simulasi fluktuasi harga pasar (opsional, bisa dihapus kalau mau angka stabil)
  const volatility = 0.98 + Math.random() * 0.04;

  if (deb === 0) return col > 0 ? 10 : 0;
  return (col * volatility) / deb;
}

export function getStatus(health: number): string {
  if (health >= 1.5) return "SAFE";
  if (health >= 1.0) return "RISKY";
  return "LIQUIDATABLE";
}
