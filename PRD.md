# SpendChain — Product Requirements Document (PRD)

**Document Version:** 2.4.0  
**Status:** Approved for Engineering & Product Execution  
**Author:** SpendChain Product & Design Engineering  
**Brand Tagline:** *Know Where Every Crypto Dollar Went.*  

---

## 1. Product Vision

**SpendChain** is a premium Web3 financial intelligence and expense management platform designed for crypto-native startups, DAOs, treasury managers, and high-velocity traders. 

By analyzing multi-chain wallet activity and converting raw, fragmented smart contract execution logs into clear, actionable financial statements, automated tax categories, gas fee audits, and AI-driven recommendations, SpendChain bridges the gap between raw blockchain data and enterprise-grade financial operations.

---

## 2. Target Audience

1. **Web3 Founders & Core Contributors:** Need clear visibility into burn rate, operational expenses (RPCs, hosting, node tooling), and payroll without sifting through Etherscan raw hashes.
2. **DAO Treasury Managers & Stewards:** Managing multi-sig Gnosis Safe treasuries requiring transparent cashflow reports, multi-chain gas fee optimization, and budget tracking.
3. **Crypto Traders & High-Net-Worth Investors:** Tracking capital gains/losses, liquid staking yields, and off-ramp transfers across EVM and Solana chains.
4. **Crypto Accountants & Tax Professionals:** Requiring standardized transaction taxonomy, deductible expense tagging, and clean CSV/QuickBooks exports.

---

## 3. Core Problem Being Solved

* **Fragmented Transaction Logs:** Raw blockchain explorers (Etherscan, Solscan) display hexadecimal hashes and raw token transfers, making business accounting and vendor identification painful.
* **Gas Fee Blind Spots:** On-chain gas fees are buried in transaction execution steps, leading to massive annual "gas leaks" across mainnets and layer 2s.
* **Lack of SaaS & Vendor Taxonomy:** Web3 teams pay for node services (Alchemy, QuickNode), hosting (Vercel, Fleek), and developer tooling in crypto without automated recurring SaaS categorization.
* **Unspent Token Approval Risks:** Smart contract approvals often remain active indefinitely with unlimited allowances, creating catastrophic security vulnerabilities.
* **Tax Readiness Friction:** Manual spreadsheets fail when handling multi-chain liquid staking, DEX swaps, and fiat off-ramping.

---

## 4. User Personas

### Persona A: Alex — Web3 Startup Founder
* **Goal:** Track monthly startup runway, team payroll, and infrastructure costs across Ethereum and Arbitrum.
* **Pain Point:** Spends 10+ hours a month manually tagging vendor addresses in spreadsheets.
* **Needs:** Automated expense categorization, PDF receipt attachments, and a quick AI executive summary.

### Persona B: Elena — DAO Treasury Steward
* **Goal:** Optimize gas execution costs on Gnosis Safe transactions and present monthly treasury reports to token holders.
* **Pain Point:** High Ethereum mainnet gas prices burning $2,000+ per month in DAO funds.
* **Needs:** L2 gas leak audits, cross-chain spend velocity analytics, and multi-wallet monitoring.

### Persona C: Marcus — Crypto Tax Consultant
* **Goal:** Prepare annual tax filings and categorize deductible business expenses for crypto clients.
* **Pain Point:** Mismatched DEX token swaps, missing invoice memos, and uncategorized transfers.
* **Needs:** Standardized tax status tags (Deductible Expense, Capital Gain/Loss, Taxable Income) and 1-click QuickBooks/Xero exports.

---

## 5. User Stories

| ID | As a... | I want to... | So that I can... |
|---|---|---|---|
| **US-01** | Treasury Manager | Connect multiple EVM & Solana wallet addresses in read-only mode | See my aggregate portfolio balance and 30-day spend velocity in one unified dashboard. |
| **US-02** | Founder | View an automated category breakdown of my wallet expenses | Identify exactly how much crypto is spent on SaaS & Infrastructure vs DeFi vs Payroll. |
| **US-03** | DAO Steward | Receive AI-generated gas audit reports | Discover how much money can be saved by migrating execution to Layer 2 chains like Arbitrum or Base. |
| **US-04** | Accountant | Assign custom accounting memos and attach PDF receipts to transactions | Maintain an audit-ready general ledger for tax season. |
| **US-05** | Security Lead | View active unspent token approvals across my monitored wallets | Identify legacy smart contracts with open allowances and simulate revoking them. |
| **US-06** | Finance Lead | Filter transactions by date, blockchain, category, and tax tag | Export custom filtered CSV reports for QuickBooks and Xero. |

---

## 6. Functional Requirements

### 6.1 Multi-Chain Wallet Intelligence
* **FR-1.1:** System shall support read-only monitoring of EVM (Ethereum, Arbitrum, Base, Optimism, Polygon PoS) and Solana wallet addresses.
* **FR-1.2:** System shall support ENS domain resolution (e.g., `treasury.spendchain.eth`).
* **FR-1.3:** System shall calculate real-time portfolio value (USD) and 30-day net spend velocity per wallet.

### 6.2 Transaction Taxonomy & Ledger
* **FR-2.1:** System shall auto-categorize transactions into standard Web3 taxonomy:
  * SaaS & Infrastructure
  * DeFi & Swaps
  * Yield & Staking
  * Payroll & Grants
  * CEX & Off-Ramp
  * Gas & Execution
* **FR-2.2:** System shall support tax status tagging (`Deductible Expense`, `Capital Gain/Loss`, `Taxable Income`, `Internal Transfer`).
* **FR-2.3:** System shall allow users to edit category, tax tag, and accounting memo notes on any transaction.
* **FR-2.4:** System shall support PDF/image receipt attachments for individual ledger entries.

### 6.3 Gas Leak & Security Auditing
* **FR-3.1:** System shall compute total USD gas fees burned across monitored wallets.
* **FR-3.2:** System shall rank top gas-consuming smart contract counterparties.
* **FR-3.3:** System shall calculate an overall Wallet Health & Security Score (0-100) based on unspent token approvals.
* **FR-3.4:** System shall provide a simulated "Revoke Approval" action for open smart contract allowances.

### 6.4 Server-Side AI Copilot (Gemini 3.6 Flash)
* **FR-4.1:** System shall proxy AI queries through a secure server-side API endpoint (`/api/ai/analyze`).
* **FR-4.2:** System shall inject real-time context (active wallets, balances, transaction ledger) into the Gemini AI system prompt.
* **FR-4.3:** AI shall generate executive summaries, gas optimization plans, recurring SaaS vendor audits, and tax loss harvesting alerts.
* **FR-4.4:** Users shall be able to export AI analysis reports in Markdown format (`.md`).

---

## 7. Non-Functional Requirements

### 7.1 Security & Data Integrity
* **NFR-1.1 (Read-Only Guarantee):** The platform shall strictly operate in read-only mode. Private keys, seed phrases, or transaction signing permissions are never requested or stored.
* **NFR-1.2 (Server-Side Key Protection):** The `GEMINI_API_KEY` must strictly reside on the server-side environment and never be exposed to the client browser.

### 7.2 Performance & Responsiveness
* **NFR-2.1 (Load Time):** The web application shall achieve a First Contentful Paint (FCP) of < 1.2s on standard broadband.
* **NFR-2.2 (Glassmorphism & FPS):** Motion animations and glassmorphism backdrop-blur filters shall maintain 60 FPS on modern desktop and mobile browsers.

### 7.3 Design System & Aesthetics
* **NFR-3.1 (Brand Palette):** Primary Canvas `#050816`, Secondary Canvas `#0B1220`, Surface `#111827`, Accent `#3B82F6` (Blue), Secondary Accent `#14B8A6` (Teal).
* **NFR-3.2 (No Crypto Clichés):** Design strictly avoids rockets, flames, memes, exaggerated neon glows, or promotional pop-ups.

---

## 8. Feature List Prioritized into MVP & Future Versions

### Phase 1: MVP (Current Release)
* [x] Landing Page with Interactive Savings Simulator & Demo Wallet Preview.
* [x] Executive Dashboard with Portfolio Net Value, 30D Spent, Inflows, and Gas Burn metrics.
* [x] Multi-Chain Wallet Analysis (EVM & Solana) with Security Health Scores and Unspent Approval Audits.
* [x] Transactions Ledger with Search, Category & Tax Filtering, and CSV Export.
* [x] Spend & Gas Analytics with 30-Day Velocity Heatmap and Chain Comparison Charts.
* [x] Server-Side Gemini AI Financial Copilot with pre-built audit triggers.
* [x] Settings Page for Workspace Name, Currency Selection, Monitored Chains, and Gas Alert Thresholds.

### Phase 2: Post-MVP Roadmap (v2.5 – v3.0)
* [ ] **Gnosis Safe Multi-Sig Authorization Integration:** Direct Safe API app connector for multi-owner approvals.
* [ ] **Automated QuickBooks & Xero Sync:** Direct REST API webhook sync into chart of accounts.
* [ ] **Automated Invoice Email Parsing:** Forwarding PDF invoices to `invoices@spendchain.app` for auto-matching to on-chain hashes.
* [ ] **Custom Category Rule Builder:** Allow users to create custom rules (e.g., "If address starts with 0x4f... map to Alchemy RPC").

---

## 9. Application Architecture

```
                                    +-----------------------------------+
                                    |     Client Single Page App        |
                                    |     (React 19, Tailwind CSS v4,   |
                                    |     Lucide Icons, Recharts)       |
                                    +-----------------+-----------------+
                                                      |
                                          HTTP POST   |  /api/ai/analyze
                                                      v
                                    +-----------------------------------+
                                    |     Express Backend Server        |
                                    |     (Server-Side API Route)       |
                                    +-----------------+-----------------+
                                                      |
                                          SDK Request |  GEMINI_API_KEY
                                                      v
                                    +-----------------------------------+
                                    |   Google Gemini 3.6 Flash Model   |
                                    |   (Server-Side Financial AI)      |
                                    +-----------------------------------+
```

---

## 10. Page-by-Page Breakdown

1. **Landing Page:** Public marketing showcase featuring value proposition, interactive wallet financial preview, gas savings simulator, feature pillars, and pricing tiers.
2. **Dashboard View:** Executive overview featuring net portfolio value, 30D spend, cashflow timeline area charts, category donut charts, and recent transaction stream.
3. **Wallet Analysis View:** Multi-wallet grid showing balances, gas fee burn, security health scores, unspent token approvals, and single-wallet AI audits.
4. **Transactions Ledger:** Complete transaction matrix with multi-parameter search, category & tax tag filters, manual expense creation, and CSV export.
5. **Spend Analytics:** Quantitative charts including 30-day velocity heatmaps, chain spend vs gas bar charts, and top protocol rankings.
6. **AI Insights Copilot:** Conversational AI chat interface with server-side Gemini integration, pre-built financial prompts, and Markdown report downloads.
7. **Settings & Integrations:** Workspace configuration, currency selection, monitored chains, gas alert thresholds, and tax export presets.

---

## 11. User Flows

### Flow 1: Connecting a Wallet & Running an AI Gas Audit
1. User clicks **Connect Wallet** in Navbar or Landing Page.
2. User selects Web3 provider (MetaMask, Phantom) or pastes address/ENS.
3. System adds wallet to monitored addresses and calculates 30-day spend and health score.
4. User clicks **AI Executive Audit** or **Audit Wallet**.
5. System forwards context to `/api/ai/analyze` and presents markdown recommendations.

### Flow 2: Categorizing a Transaction & Exporting Tax Ledger
1. User navigates to **Transactions Matrix**.
2. User filters transactions by `Deductible Expense` or `SaaS & Infrastructure`.
3. User clicks on a transaction to edit the category, tax tag, or accounting memo note.
4. User clicks **Export CSV** to download an audit-ready tax statement.

---

## 12. Success Metrics

* **Active Monitored Wallets per Account:** Target > 3.5 wallets.
* **Categorization Accuracy:** Target > 95% automated mapping accuracy.
* **Gas Savings Delivered:** Average > 30% reduction in annual gas costs via AI recommendations.
* **Tax Export Usage:** Target > 60% of active teams exporting CSV or QuickBooks logs quarterly.

---

## 13. Edge Cases

* **Invalid or Unreachable Wallet Address:** System falls back to a clean error banner and prompts user to verify string format.
* **Missing `GEMINI_API_KEY`:** System gracefully handles server-side errors, displaying a fallback message explaining how to set up the secret.
* **Solana vs EVM Chain Differences:** System handles base58 Solana transaction hashes and SOL gas units alongside EVM hex addresses.
* **Zero Transaction History:** Wallet displays a clean empty state with recommendations to connect an active wallet.

---

## 14. Future Roadmap

* **Q4 2026:** Gnosis Safe App Plugin & Native Slack/Discord Treasury Notifications.
* **Q1 2027:** Automated Tax Loss Harvesting Execution Engine.
* **Q2 2027:** Multi-currency fiat hedging suggestions & yield strategy auto-routing.
