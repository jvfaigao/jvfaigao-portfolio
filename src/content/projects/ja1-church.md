---
name: JA1 Church Management System
summary: Members, events, attendance and teams across multiple church branches.
group: production
order: 1
status: production
role: Solo developer
year: '2026'
stack: [React, Firebase]
meta: About 500 users
liveUrl: https://ja1-attendance.web.app
result:
  headline: About 500 users
  line: Across multiple church branches, with attendance taken by QR scan.
quote:
  text: We can now keep track of who attends every Sunday and manage our members better. No more listing attendees by hand. One QR scan and their attendance is in.
  by: Admin, JA1 Church
screenshots:
  - src: ../../assets/projects/ja1-church/1.webp
    alt: "JA1 Church public website: upcoming Sunday services"
  - src: ../../assets/projects/ja1-church/2.webp
    alt: "Attendance scanner, ready for a member QR code"
  - src: ../../assets/projects/ja1-church/3.webp
    alt: "A member's Anointed Journey progress"
demo:
  width: 1432
  height: 720
  label: "Demo: browsing the JA1 Church public website"
diagram: ja1
intro: "Members, events, attendance and teams for JA1 Church, used across multiple church branches."
---

## The problem

Attendance at every service was listed by hand, so leaders had no easy way to see who attended or to manage members across branches.

## What I built

- Three ways to take attendance: QR scan, manual search, and a scanner device, with a kiosk display that keeps working offline.
- Member records, accounts and teams for each branch.
- Events and attendance reports for leaders.
- A public website for each branch.
- Four access roles, with the data secured by Firestore rules and App Check.
