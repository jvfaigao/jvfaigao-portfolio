// Generates the favicon set and the link preview card (public/og.png) from the logo and photo.
// Run: node scripts/make-icons.mjs   (needs the Playwright Chromium: npx playwright install chromium)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { chromium } from '@playwright/test';

const root = new URL('../', import.meta.url);
const at = (p) => fileURLToPath(new URL(p, root));
const logoPath = readFileSync(at('public/logo.svg'), 'utf8').match(/<path d="([^"]+)"/)[1];

// Favicon: white logo on a black rounded square, proportions from the design canvas (180px: radius 40, padding 29).
const S = 180;
const pad = 29;
const w = S - pad * 2;
const h = (w * 1051) / 1429;
const scale = w / 1429;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
<rect x="0.5" y="0.5" width="${S - 1}" height="${S - 1}" rx="40" fill="#000" stroke="#2A2A2A"/>
<path fill="#fff" fill-rule="evenodd" transform="translate(${pad} ${(S - h) / 2}) scale(${scale})" d="${logoPath}"/>
</svg>\n`;
writeFileSync(at('public/favicon.svg'), iconSvg);
for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-512.png', 512]]) {
  await sharp(Buffer.from(iconSvg), { density: (72 * size) / S * 4 }).resize(size, size).png().toFile(at(`public/${file}`));
}

// OG card: render the design canvas's card in Chromium so the real fonts are used.
const font = (p) => `url(data:font/woff2;base64,${readFileSync(at(p)).toString('base64')})`;
const photo = `data:image/webp;base64,${readFileSync(at('src/assets/jv-photo.webp')).toString('base64')}`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:'BSD';font-weight:800;src:${font('node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-800-normal.woff2')}}
@font-face{font-family:'SG';font-weight:100 900;src:${font('node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2')}}
body{margin:0}
.card{position:relative;width:1200px;height:630px;overflow:hidden;background:#000;color:#fff;font-family:'SG',sans-serif}
.word{position:absolute;left:0;top:28px;width:1200px;-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 30%,rgba(0,0,0,.4) 62%,transparent 95%)}
.word svg{display:block;width:100%;height:auto}
.photo{position:absolute;right:96px;bottom:0;height:560px;-webkit-mask-image:linear-gradient(to bottom,#000 80%,transparent 100%)}
.brand{position:absolute;left:64px;top:48px;display:flex;align-items:center;gap:14px;font-size:26px;font-weight:600}
.brand svg{width:52px;height:auto;display:block}
.foot{position:absolute;left:64px;bottom:60px;width:560px}
.role{font-size:22px;color:#A3A3A3}
.head{margin-top:10px;font-size:42px;line-height:1.1;font-weight:600;letter-spacing:-0.02em}
</style></head><body><div class="card">
<div class="word"><svg viewBox="0 0 1000 345"><text x="0" y="336" textLength="1000" lengthAdjust="spacingAndGlyphs" font-family="BSD" font-weight="800" font-size="417" fill="#E3261C">FAIGAO</text></svg></div>
<img class="photo" src="${photo}" alt="">
<div class="brand"><svg viewBox="0 0 1429 1051" fill="#fff" fill-rule="evenodd"><path d="${logoPath}"/></svg>JV Faigao</div>
<div class="foot"><div class="role">Web Developer · Antipolo City</div><div class="head">I build complete systems that real people use every day.</div></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: at('public/og.png') });
await browser.close();
console.log('icons and og.png written to public/');
