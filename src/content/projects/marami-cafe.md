---
name: Marami Cafe POS and Online Ordering
summary: Point of sale, online orders, kitchen display and inventory for Marami Cafe.
group: production
order: 2
status: production
role: Solo developer
year: '2026'
stack: [React, Supabase (PostgreSQL), Dexie.js, PWA]
meta: In daily use
liveUrl: https://marami-cafe-pos-system.vercel.app/order
liveLabel: Order online
result:
  headline: In daily use
  line: Every printed bill is now tied to a recorded sale, and stock is counted against what was actually sold.
quote:
  text: "Our POS is easier to use now because the features aren't limited anymore. Ordering is faster since we have online orders, and we don't check the inventory by hand as much. The kitchen display helps a lot too. Our kitchen is far from the counter, so no more going up and down."
  by: Owner, Marami Cafe
thumb: marami
diagram: marami
intro: "Point of sale, online orders, kitchen display and inventory for Marami Cafe, in daily use on one Android tablet."
---

## The problem

The café ran on a subscription POS and a paper notebook for stock. Inventory never matched sales, and a bill could be printed and its order deleted, so the sale was never recorded.

## What I built

- A POS on an Android tablet with per-employee PIN login, open orders, mixed cash and GCash payments, and shift cash counts.
- Online ordering connected to the POS: orders appear on the tablet and are paid at the counter.
- A kitchen display for food orders, so the cook sees each order once it's paid.
- Ingredient-level inventory with recipes, daily counts, wastage, and low-stock alerts.
- Offline mode: sales save on the tablet first with Dexie.js and sync to Supabase when the connection is back.
