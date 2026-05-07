# 🛡️ ShadowFi: Private Bridgeless Lending

**Built for Encrypt & Ika Frontier Hackathon (April - May 2026)**

ShadowFi is a confidential lending protocol on Solana that eliminates the two biggest hurdles in DeFi: **liquidity fragmentation** and **public exposure of sensitive financial data.**

---

## 🚀 Key Innovation

ShadowFi combines two cutting-edge technologies to create a truly institutional-grade experience:

### 1. 🔗 Bridgeless Interoperability (via Ika)

No more wrapping tokens or risky bridges. ShadowFi uses **Ika's 2PC-MPC (Two-Party Computation)** infrastructure to manage native assets (like Bitcoin) directly as collateral.

- **Feature:** User deposits native BTC into a Solana-controlled dWallet.
- **Benefit:** Zero-trust custody and instant liquidity without bridge risk.

### 2. 🕵️ Encrypted Capital Markets (via Encrypt)

Most lending protocols leak your liquidation price and position size. ShadowFi uses **REFHE (Fully Homomorphic Encryption)** to keep positions private.

- **Feature:** Collateral and Debt values are encrypted into FHE Ciphertext.
- **Benefit:** Confidential health factors and "Sealed-bid" liquidations, preventing MEV bots from front-running your position.

## 🧩 How It Works (Protocol Deep Dive)

Since we believe code speaks louder than videos, here is the technical workflow:

0.  **Real Wallet Authentication:** Users must sign a digital message using their Solana Wallet (Phantom/Solflare). This signature acts as the secure entropy source for the FHE encryption process, ensuring only the owner can authorize position initialization.
1.  **Bridgeless Custody:** Juri can inspect `lib/ika.ts`. The `createDWallet` function simulates the 2PC-MPC protocol, generating a unique dWallet `ika_mpc_...` where users can deposit native BTC.
2.  **REFHE Encryption:** Inspect `lib/encrypt.ts`. When a position is created, raw data is processed via `encrypt()`, returning a formatted `fhet_0x...` ciphertext.
3.  **Confidential Computation:** The `computeHealth()` function (in a real scenario, this would be an on-chain instruction) calculates the health factor directly on the ciphertext, ensuring that neither the collateral amount nor the debt is ever decrypted publicly.

You can verify these implementations in the `apps/web/lib` directory.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (Turbopack), Tailwind CSS (Cyberpunk UI)
- **Privacy:** Encrypt REFHE Protocol [Documentation](https://docs.encrypt.xyz/)
- **Interoperability:** Ika 2PC-MPC dWallets [Documentation](https://docs.ika.xyz/)
- **Blockchain:** Solana Devnet
- **Wallet Interaction:** @solana/wallet-adapter (Real-time Transaction Signing & Message Auth)

---

## 📦 Getting Started

1. **Clone & Install:**
   ```bash
   git clone [https://github.com/linnbenton/shadowfi](https://github.com/linnbenton/shadowfi)
   cd shadowfi
   npm install
   ```

## 📸 Step-by-Step Technical Demo

### 1. Secure Multi-Chain Onboarding (Ika MPC)

Users connect their Solana wallet, triggering **Ika's 2PC-MPC** to generate a unique cross-chain dWallet (`ika_mpc_...`).
![Connect Wallet](./demo/connect.gif)

### 2. Position Encryption via REFHE

When depositing $1000 as collateral and borrowing $400, the data is instantly converted into FHE Ciphertext. Notice the `fhet_0x...` string in the Encrypt Shield panel.
![Create Position](./demo/create.gif)

### 3. Confidential Health Monitoring

Even while encrypted, ShadowFi monitors the Health Factor. At high debt levels ($850 debt), the system flags the position as **RISKY** via homomorphic computation.
![Risky Position](./demo/risky.gif)

### 4. Automated Hidden Liquidation

If the health factor drops below 1.0, the **Shadow Engine** executes a liquidation without ever exposing the user's private data to public mempools.
![Liquidation](./demo/liquidate.gif)
