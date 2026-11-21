---
name: Urban Towns Attendance and Payroll
summary: QR clock-in for site workers, with payroll and CSV export for accounting.
group: production
order: 3
status: production
role: Solo developer
year: '2026'
stack: [React, Vite, Supabase (PostgreSQL, Edge Functions), PWA]
meta: 20–50 workers daily
liveUrl: https://urban-towns-attendance.web.app/
result:
  headline: 20–50 workers daily
  line: Workers clock in by QR, and payroll exports straight to CSV.
quote:
  text: We save a lot of time computing salaries now. And we can always check if our workers really showed up for work.
  by: Owner, Urban Towns
screenshots:
  - src: ../../assets/projects/urban-towns/1.webp
    alt: "Payroll and reports: choosing a construction site"
  - src: ../../assets/projects/urban-towns/2.webp
    alt: "Attendance for a site, with late and present status (names hidden)"
  - src: ../../assets/projects/urban-towns/3.webp
    alt: "Payroll for a site and pay period (names hidden)"
demo:
  width: 1446
  height: 720
  label: "Demo: opening payroll for a construction site (names hidden)"
diagram: urban
intro: "QR attendance and payroll for Urban Towns' construction sites."
---

## The problem

Attendance was written on paper, and each foreman computed his crew's pay by hand every week.

## What I built

- QR clock-in at each construction site, from a phone that keeps working offline.
- Worker and site records, with username login, per-user permissions, and four roles from admin to foreman.
- Time, status and pay computed on the server only, so nothing sent from a phone can change them.
- Payroll for each Saturday-to-Friday period, and CSV export on every page for accounting.
