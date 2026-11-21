// Turns the raw screen recordings in website_Photos/ (not committed) into:
//   src/assets/projects/<slug>/<n>.webp   screenshots (Astro optimizes them at build)
//   public/media/<slug>.mp4 + .webp       a short muted demo clip and its poster
// Needs ffmpeg on PATH (winget install Gyan.FFmpeg). Run: node scripts/make-media.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const RAW = `${root}website_Photos/`;
const FFMPEG = process.env.FFMPEG ?? 'ffmpeg';

// Times are seconds into the recording; a shot can pass its own blur list as a third item. `blur` boxes hide personal data (names, emails, phones),
// in the recording's own pixels; they apply to every shot and the clip of that recording.
const MEDIA = {
  'ja1-church': {
    file: 'JA1 Church.mp4',
    shots: [
      [10, 'JA1 Church public website: upcoming Sunday services'],
      [34, 'Attendance scanner, ready for a member QR code'],
      [46, "A member's Anointed Journey progress"],
    ],
    clip: [2, 14],
  },
  'marami-cafe': {
    file: 'Marami POS&Kitchen.mp4',
    blur: [{ x: 1540, y: 10, w: 250, h: 60 }], // cashier's name in the POS header
    shots: [
      [14, 'POS: choosing a drink size and add-ons'],
      [46, 'Kitchen display with a paid food order'],
    ],
    extra: [
      { file: 'Marami Admin.mp4', at: 18, alt: 'Admin: ingredient inventory with stock levels', blur: [{ x: 0, y: 770, w: 320, h: 80 }] },
      { file: 'Online_ordering.mp4', at: 30, alt: "Online ordering on a customer's phone: reviewing the order" },
    ],
    clip: [10, 21],
  },
  'urban-towns': {
    file: 'Urbantowns.mp4',
    blur: [
      { x: 330, y: 715, w: 270, h: 205 }, // worker names column (payroll)
      { x: 520, y: 565, w: 260, h: 50 }, // foreman's name
    ],
    shots: [
      [18, 'Payroll and reports: choosing a construction site', []], // no names on this screen
      [
        10,
        'Attendance for a site, with late and present status (names hidden)',
        [
          { x: 350, y: 395, w: 420, h: 45 }, // worker named in the "needs confirmation" note
          { x: 620, y: 540, w: 330, h: 380 }, // worker names column (attendance)
        ],
      ],
      [22, 'Payroll for a site and pay period (names hidden)'],
    ],
    clip: [15, 22],
  },
  'degz-athletic-club': {
    file: 'Degz booking.mp4',
    shots: [
      [6, 'Degz Athletic Club website: play, train, recover'],
      [14, 'Booking a basketball court: hours and deposit'],
      [22, 'Revive Den: picking an evening time slot'],
    ],
    clip: [6, 16],
  },
  faceattend: {
    file: 'FaceAttend.mp4',
    shots: [
      [22, 'FaceAttend home: attendance by face, recorded on the device'],
      [26, 'Setup: choosing who will use FaceAttend'],
      [82, 'Settings: use case and liveness check'],
    ],
    clip: [20, 32],
  },
  ambagpay: {
    file: 'AmbagPay.mp4',
    blur: [{ x: 1060, y: 30, w: 500, h: 60 }], // signed-in email in the header
    shots: [
      [2, 'AmbagPay home: every peso, accounted for'],
      [10, 'Public ledger with budgets and AI-checked expenses'],
      [18, 'Officer page: upload a receipt and approve expenses'],
    ],
    clip: [2, 12],
  },
  'thesis-payroll': {
    image: 'Automated payroll system.png',
    alt: 'University of Rizal System Payroll System sign-in page',
  },
};

const ff = (args) => execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

function blurFilter(boxes = [], tail = '') {
  if (!boxes.length) return tail ? `[0:v]${tail}[out]` : '[0:v]null[out]';
  let chain = '';
  let cur = '0:v';
  boxes.forEach((b, i) => {
    chain += `[${cur}]split[base${i}][tmp${i}];[tmp${i}]crop=${b.w}:${b.h}:${b.x}:${b.y},gblur=sigma=16[bl${i}];[base${i}][bl${i}]overlay=${b.x}:${b.y}[v${i}];`;
    cur = `v${i}`;
  });
  return `${chain}[${cur}]${tail || 'null'}[out]`;
}

function still(file, at, out, blur) {
  ff(['-ss', String(at), '-i', RAW + file, '-frames:v', '1', '-filter_complex', blurFilter(blur), '-map', '[out]', '-c:v', 'libwebp', '-quality', '86', out]);
}

const report = [];
for (const [slug, m] of Object.entries(MEDIA)) {
  const dir = `${root}src/assets/projects/${slug}/`;
  mkdirSync(dir, { recursive: true });

  if (m.image) {
    ff(['-i', RAW + m.image, '-c:v', 'libwebp', '-quality', '86', `${dir}1.webp`]);
    continue;
  }

  const shots = [...m.shots.map(([at, , blur]) => ({ file: m.file, at, blur: blur ?? m.blur })), ...(m.extra ?? []).map((e) => ({ ...e, blur: e.blur ?? (e.file === m.file ? m.blur : undefined) }))];
  shots.forEach((s, i) => still(s.file, s.at, `${dir}${i + 1}.webp`, s.blur));

  const [from, to] = m.clip;
  mkdirSync(`${root}public/media`, { recursive: true });
  const mp4 = `${root}public/media/${slug}.mp4`;
  ff([
    '-ss', String(from), '-to', String(to), '-i', RAW + m.file,
    '-filter_complex', blurFilter(m.blur, 'scale=-2:720,fps=30'), '-map', '[out]',
    '-an', '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', mp4,
  ]);
  ff(['-ss', String((to - from) * 0.8), '-i', mp4, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', `${root}public/media/${slug}.webp`]);

  // Self-check: a clip that grows past 4 MB would hurt page speed on mobile data.
  const mb = statSync(mp4).size / 1e6;
  if (mb > 4) throw new Error(`${slug}.mp4 is ${mb.toFixed(1)} MB; shorten the clip or raise -crf`);
  report.push(`${slug}: ${shots.length} shots, clip ${to - from}s ${mb.toFixed(2)} MB`);
}
console.log(report.join('\n'));
