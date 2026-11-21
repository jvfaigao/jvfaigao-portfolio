---
name: FaceAttend
summary: Face-recognition attendance that rejects photos and videos of a face.
group: other
order: 5
status: competition
role: Solo developer
year: '2026'
stack: [React, Human (face recognition), MiniFAS (anti-spoofing), Vercel]
meta: CPEYESTA 2026
liveUrl: https://faceattend-kohl.vercel.app/
result:
  headline: Champion
  line: CPEYESTA System Making 2026.
screenshots:
  - src: ../../assets/projects/faceattend/1.webp
    alt: "FaceAttend home: attendance by face, recorded on the device"
  - src: ../../assets/projects/faceattend/2.webp
    alt: "Setup: choosing who will use FaceAttend"
  - src: ../../assets/projects/faceattend/3.webp
    alt: "Settings: use case and liveness check"
demo:
  width: 1420
  height: 720
  label: "Demo: the FaceAttend home page and first-time setup"
diagram: faceattend
intro: "Face-recognition attendance for a classroom, built for the CPEYESTA System Making competition."
---

## The problem

Face attendance is easy to fool: someone can hold up a photo or play a video of a classmate's face.

## What I built

- Face-based attendance and a daily time record that run fully in the browser, with no server and the AI models bundled so it works offline.
- An anti-spoofing model (MiniFAS) that rejects photos and videos of a face, and asks for one random head or mouth movement only when it is unsure.
- Consent at enrollment, and only face embeddings are stored, never photos, following the Data Privacy Act (RA 10173).
- FaceAttend Lock, a Chrome extension that uses the same face engine to lock chosen social media sites until the owner's face is verified.
