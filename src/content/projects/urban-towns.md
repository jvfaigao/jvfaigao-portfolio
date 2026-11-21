---
name: Urban Towns Attendance and Payroll
summary: QR clock-in for site workers, with payroll and CSV export for accounting.
group: production
order: 3
status: production
role: Solo developer
year: '2026'
stack: [React, Supabase (PostgreSQL, Edge Functions), PWA]
meta: 20–50 workers daily
liveUrl: https://urban-towns-attendance.web.app/
result:
  headline: 20–50 workers daily
  line: Workers clock in by QR, and payroll exports straight to CSV.
quote:
  text: We save a lot of time computing salaries now. And we can always check if our workers really showed up for work.
  by: Owner, Urban Towns
thumb: urban
diagram: urban
intro: "QR attendance and payroll for Urban Towns' construction sites."
---

## The problem

Attendance was written on paper, and each foreman computed his crew's pay by hand every week.

## What I built

- QR clock-in at each construction site, from a phone that keeps working offline.
- Worker and site records, with staff logging in by username.
- Time, status and pay computed on the server only, so nothing sent from a phone can change them.
- Payroll for each Saturday-to-Friday period, exported to CSV for accounting.
