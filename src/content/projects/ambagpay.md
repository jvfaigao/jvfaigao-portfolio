---
name: AmbagPay
summary: Transparent class and organization fee collection on BNB Smart Chain.
group: other
order: 6
status: hackathon
role: Team Kiro (Jv, Jayson, Jaizel)
year: '2026'
stack: [React, TypeScript, Solidity, BNB Smart Chain Testnet, Gemini, Vercel functions]
meta: November 2026
repoUrl: https://github.com/jvfaigao/AmbagPay
thumb: ambagpay
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
