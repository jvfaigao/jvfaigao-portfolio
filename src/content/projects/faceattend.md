---
name: FaceAttend
summary: Face-recognition attendance that rejects photos and videos of a face.
group: other
order: 5
status: competition
role: Developer
year: '2026'
stack: [React, Vite, Human (face AI), Dexie.js, Chrome extension]
meta: CPEYESTA 2026
liveUrl: https://faceattend-kohl.vercel.app/
result:
  headline: Champion
  line: CPEYESTA System Making 2026.
thumb: faceattend
diagram: faceattend
intro: "Face-recognition attendance for a classroom, built for the CPEYESTA System Making competition."
---

## The problem

Face attendance is easy to fool: someone can hold up a photo or play a video of a classmate's face.

## What I built

- Face recognition that runs in the browser, with the AI models bundled so it works offline.
- A liveness check that blocks photos and phone screens, and asks for one random head or mouth movement only when it is unsure.
- Consent at enrollment, and only face embeddings are stored, never photos, following the Data Privacy Act (RA 10173).
- FaceAttend Lock, a Chrome extension that uses the same face engine to lock chosen social media sites until the owner's face is verified.
