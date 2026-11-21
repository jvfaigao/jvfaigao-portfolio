---
name: Degz Athletic Club Booking System
summary: Court and training bookings with GCash deposits and an owner dashboard.
group: production
order: 4
status: production
role: Solo developer
year: '2026'
stack: [React, TypeScript, Supabase, Cloudflare Pages]
meta: In use by customers
liveUrl: https://degz-athletic-club.pages.dev/
result:
  headline: Booked online
  line: Customers book courts and pay deposits online through GCash.
quote:
  text: "Booking a court, training or a recovery session is much faster now, and our schedule is more organized. Before, we wrote everything on paper, and sometimes two clients booked the same slot without the owner or staff knowing. That doesn't happen anymore."
  by: Owner, Degz Athletic Club
screenshots:
  - src: ../../assets/projects/degz-athletic-club/1.webp
    alt: "Degz Athletic Club website: play, train, recover"
  - src: ../../assets/projects/degz-athletic-club/2.webp
    alt: "Booking a basketball court: hours and deposit"
  - src: ../../assets/projects/degz-athletic-club/3.webp
    alt: "Revive Den: picking an evening time slot"
demo:
  width: 1422
  height: 720
  label: "Demo: booking a basketball court on the Degz website"
diagram: degz
intro: "Online booking for Degz Athletic Club's courts and training, and its Revive Den recovery sessions."
---

## The problem

Bookings were written on paper, and two clients sometimes booked the same slot without the owner or staff knowing.

## What I built

- Online booking for basketball and pickleball courts, training, and Revive Den recovery sessions.
- GCash deposits with proof upload, reviewed by staff before a booking is confirmed.
- Packages that customers buy and use for later sessions.
- An admin area for the front desk: today's bookings, check-in, calendar, and staff roles and permissions.
- An owner dashboard with revenue reports, date blocking, and editable site content.
- Database rules that stop two bookings from taking the same slot.
