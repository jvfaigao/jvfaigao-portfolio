---
name: AmbagPay
summary: Transparent class and organization fee collection on BNB Smart Chain.
group: other
order: 6
status: hackathon
role: Sole developer in a team of 3 (Team Kiro)
year: '2026'
stack: [React, TypeScript, Solidity, BNB Smart Chain Testnet, Gemini, Vercel functions]
meta: November 2026
repoUrl: https://github.com/jvfaigao/AmbagPay
screenshots:
  - src: ../../assets/projects/ambagpay/1.webp
    alt: "AmbagPay home: every peso, accounted for"
  - src: ../../assets/projects/ambagpay/2.webp
    alt: "Public ledger with budgets and AI-checked expenses"
  - src: ../../assets/projects/ambagpay/3.webp
    alt: "Officer page: upload a receipt and approve expenses"
demo:
  width: 1444
  height: 720
  label: "Demo: the AmbagPay home page and public ledger"
diagram: ambagpay
intro: "Transparent student contributions for student organizations, built for the BCC 2026 × Binance Academy Hackathon."
---

## The problem

Students pay org fees and class contributions but rarely see where the money goes. Treasurers struggle to prove they handled funds honestly, and leftovers are rarely returned.

## What I built

- Google login with an embedded wallet, so members pay a fee in one tap with no wallet setup and no gas.
- An AI Treasurer Agent (Gemini) that reads each receipt, checks for duplicates, budget and price history, and proposes the expense on-chain with a risk level.
- A smart contract, AmbagVault, that enforces budget caps and approvals: the treasurer, plus the adviser for amounts over ₱1,000 or high risk.
- A public ledger with every receipt and its BscScan transaction.
