# JV Faigao Portfolio Implementation Plan (v2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved black/white/red portfolio (Home about JV, Projects page, project pages, phone bottom nav, contact form) as a fast Astro site on Vercel.

**Architecture:** Static Astro pages built from typed content collections and JSON data. The only on-demand route is `/api/contact`, which sends mail through Resend. The approved preview canvas is the visual reference for every page.

**Tech Stack:** Astro (latest stable), TypeScript strict, `@astrojs/vercel`, `@astrojs/sitemap`, `@fontsource/big-shoulders-display`, `@fontsource-variable/schibsted-grotesk`, `simple-icons`, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-20-portfolio-design.md` (v2)

## Global Constraints

- Tokens exactly as in spec §4 (dark default, light via toggle). `--red #E3261C` is for fills and large text only. Small red text uses `--redtext`.
- Display font: Big Shoulders Display 800, uppercase. Text font: Schibsted Grotesk. Both self-hosted.
- Exactly one solid-red primary action per view (View projects in the hero; Download CV is an outline pill on desktop and a small solid pill on phones, where it is the only red action in the top bar).
- Copy, links, numbers, results and quotes exactly as in spec §6–§8. Never invent a number or a quote.
- Breakpoints: 900px (hero stacks), 820px (diagram goes vertical), 760px (project rows compact), 640px (phone: bottom nav on, header links off).
- Motion only as spec §4 Motion. Everything stops under `prefers-reduced-motion`.
- Quality: Lighthouse mobile 95+; WCAG AA both themes; visible focus; no horizontal scroll at 360px; no layout shift.
- Contact email `faigaojv027@gmail.com`; GitHub `https://github.com/jvfaigao`; LinkedIn `https://www.linkedin.com/in/john-vincent-faigao-68a93744a`.

## Review Focus

1. **Bottom nav covering content:** on a 360×640 phone the last footer line and the contact form's submit button are fully visible above the nav, including with a safe-area inset. Test: Task 1 `bottom nav never covers footer`.
2. **FAIGAO before the font loads:** the hero word still spans the full width (`textLength`) with the fallback font and there's no layout shift when Big Shoulders loads. Test: Task 3 `hero word spans viewport with fallback font`.
3. **`localStorage` throws:** the theme toggle still works for the session. Test: Task 1 `toggle works when localStorage throws`.
4. **Contact failure or no JS:** the visitor sees a clear message with the email address. Test: Task 5 `no-JS submit shows result page`, `send failure shows email fallback`.
5. **Long names at 360px:** "Automated Attendance and Payroll System (Thesis)" and "MARAMI CAFE POS AND ONLINE ORDERING" wrap without overflow. Test: Task 4 `no horizontal overflow at 360px`.

---

## File structure

```
astro.config.mjs                 site URL, vercel adapter, sitemap
src/styles/tokens.css            color + type tokens, dark/light
src/styles/global.css            reset, base type, focus, .wrap, .disp
src/layouts/Base.astro           head (meta, OG, theme pre-paint, router), Header, BottomNav, Footer, slot
src/components/
  Header.astro  ThemeToggle.astro  BottomNav.astro  Footer.astro  Logo.astro
  home/ Hero.astro  HowIWork.astro  Testimonial.astro  TechStack.astro  About.astro  BeyondCode.astro  WorkTogether.astro
  projects/ ProjectRow.astro  StatusLabel.astro  ResultBlock.astro  Quote.astro  Gallery.astro  CtaBand.astro
  diagrams/ ja1.astro  marami.astro  urban.astro  degz.astro  faceattend.astro  ambagpay.astro  thesis.astro  index.ts
  ContactForm.astro
src/content.config.ts            projects schema
src/content/projects/*.md        7 projects
src/data/social.json  src/data/stack.json
src/lib/{projects,contact,theme,activeSection}.ts
src/assets/jv-photo.png  src/assets/projects/<slug>/...
public/logo.svg  public/favicon.svg  public/favicon-32.png  public/apple-touch-icon.png  public/icon-512.png  public/og.png
public/JV-Faigao-CV.pdf  public/robots.txt
src/pages/index.astro  projects/index.astro  projects/[slug].astro  api/contact.ts  contact-result.astro  404.astro
tests/unit/*.test.ts  tests/e2e/*.spec.ts
```

Assets already prepared: `JV-logo.svg` (traced logo, `currentColor`-ready), `jv-photo.png` (cutout). Copy them in during Task 1.

---

### Task 1: Scaffold, tokens, layout, header, theme, bottom nav

**Files:** scaffold (`npm create astro@latest -- --template minimal --typescript strict`), `astro.config.mjs`, `src/styles/*`, `src/layouts/Base.astro`, `src/components/{Header,ThemeToggle,BottomNav,Footer,Logo}.astro`, `src/lib/{theme,activeSection}.ts`, `vitest.config.ts`, `playwright.config.ts`. Tests: `tests/unit/{contrast,theme,activeSection}.test.ts`, `tests/e2e/shell.spec.ts`.

**Interfaces:**
- `Base.astro` props `{ title: string; description: string; navActive: 'home' | 'projects' | 'about' | 'contact'; ogImage?: string }`.
- `theme.ts`: `getStoredTheme(): 'dark' | 'light' | null`, `storeTheme(t): void` (both swallow storage errors). The theme lives in `html[data-theme]`; the default is `dark`.
- `activeSection.ts`: `sectionToNav(id: string): 'home' | 'about' | 'contact' | null`, mapping `top → home`, `how|words|stack|about|personal → about`, `contact → contact`.
- `BottomNav.astro` props `{ active: NavKey }`. On Home, a small inline script uses IntersectionObserver (`rootMargin: '-45% 0px -50% 0px'`) and `sectionToNav` to move the bubble.
- npm scripts: `dev`, `build`, `test`, `test:e2e`, `check`.

- [ ] Step 1: Scaffold, install deps, and copy the logo into `src/components/Logo.astro` as an inline SVG with `fill="currentColor"`. Set `site: 'https://jvfaigao.vercel.app'`. `npm run build` passes.
- [ ] Step 2: Write failing tests. `contrast.test.ts` (WCAG ratio ≥ 4.5 for text/bg, muted/bg, redtext/bg in both themes; white on `#E3261C` ≥ 4.5). `theme.test.ts` (throwing storage → `null`, no throw). `activeSection.test.ts` (each mapping above; unknown → `null`). `shell.spec.ts`: `dark by default`, `toggle persists across reload`, `toggle works when localStorage throws`, `desktop shows header links and hides bottom nav` (1280px), `phone shows bottom nav with 4 items and CV pill` (390px), `bubble moves on tap` (bubble `left` changes after tapping About), `bottom nav never covers footer` (360×640: footer's last line bottom ≤ nav top after scrolling to the end).
- [ ] Step 3: Run the tests. Expected: FAIL.
- [ ] Step 4: Implement to match the preview: notch circle `--bg`, bubble 54px `--red`, bar 66px tall, radius 20px, 12px side margin, `env(safe-area-inset-bottom)`, footer bottom padding 116px on phones.
- [ ] Step 5: Run the tests. Expected: PASS. Commit `feat: scaffold site shell with theme, header and phone bottom nav`.

### Task 2: Content and data

**Files:** `src/content.config.ts`, `src/content/projects/*.md` (7), `src/data/{social,stack}.json`, `src/lib/projects.ts`. Tests: `tests/unit/{projects,data}.test.ts`.

**Interfaces:**
- Project schema: `{ name; summary (≤ 90 chars); group: 'production' | 'other'; order; status: 'production' | 'competition' | 'hackathon' | 'team'; role; year; stack: string[]; meta: string; liveUrl?: url; repoUrl?: url; result?: { headline: string; line: string }; quote?: { text: string; by: string }; thumbnail: image(); screenshots: { src: image(); alt: string }[]; diagram: DiagramKey }`. Slug = filename: `ja1-church`, `marami-cafe`, `urban-towns`, `degz-athletic-club`, `faceattend`, `ambagpay`, `thesis-payroll`.
- `getGroupedProjects(): Promise<{ production: Project[]; other: Project[] }>` sorted by `order`.
- `social.json`: `{ updatedAt: 'YYYY-MM-DD', facebook: { name, url, followers: '69.5K' }, tiktok: { name: '@jv.faigao', url, followers: '23.3K' } }`.
- `stack.json`: four groups exactly as in spec §6.4; each item `{ label: string; icon?: string }`, where `icon` is a Simple Icons slug when one exists.

All values come from spec §6–§8. The bodies are `## The problem` + `## What I built`, drawn from the CV bullets.

- [ ] Step 1: Write failing tests: group order (production: ja1, marami, urban, degz; other: faceattend, ambagpay, thesis); every production project has `liveUrl`, `result` and `quote`; every `quote.text` exactly equals spec §8; `social.json` matches spec §6.6; every `stack.json` `icon` exists in `simple-icons`.
- [ ] Step 2: Run. FAIL. Step 3: Implement. Step 4: Run. PASS. Commit `feat: add project content, social and stack data`.

### Task 3: Home page

**Files:** `src/pages/index.astro`, `src/components/home/*.astro`, `src/components/ContactForm.astro` (UI only; endpoint in Task 5), `src/assets/jv-photo.png`. Test: `tests/e2e/home.spec.ts`.

Hero: FAIGAO as inline `<svg viewBox="0 0 1000 345"><text x="0" y="336" textLength="1000" lengthAdjust="spacingAndGlyphs" font-size="417">`, absolutely positioned at `width: 100vw`, with mask `linear-gradient(to bottom, #000 0%, #000 28%, rgba(0,0,0,.4) 60%, transparent 92%)`. Photo via `<Image>` with bottom mask `#000 78% → transparent`. Grid `1fr minmax(300px,440px) 1fr`, min-height `max(680px, calc(34.5vw + 230px))`. Under 900px it becomes one column, with the photo `order: -1; margin-top: 13vw`.

- [ ] Step 1: Write failing tests: `hero copy and stats` (exact text); `hero word spans viewport with fallback font` (block the font request → svg width equals viewport width ±1px); `sections in order` (how, words, stack, about, personal, contact); `testimonial is Urban Towns quote`; `stack shows 4 groups with icons`; `beyond code shows 69.5K and 23.3K with correct links`; `reduced motion disables rise animation`; `no horizontal overflow at 360px`.
- [ ] Step 2: Run. FAIL. Step 3: Implement to match the preview. Step 4: Run. PASS. Commit `feat: build home page`.

### Task 4: Projects page and project pages

**Files:** `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/components/projects/*`, `src/components/diagrams/*`. Test: `tests/e2e/projects.spec.ts`.

- [ ] Step 1: Write failing tests: `projects page lists 4 + 3 in order with Visit site links`; `each of 7 pages renders title, result (if any), quote (if any)`; `marami page shows Order online link`; `screenshots section hidden when empty`; `diagram wide at 1280, vertical at 390`; `card to page view transition` (skip if unsupported); `no horizontal overflow at 360px` on `/projects/thesis-payroll` and `/projects/marami-cafe`.
- [ ] Step 2: Run. FAIL. Step 3: Implement. Step 4: Run. PASS. Commit `feat: add projects page and project pages`.

### Task 5: Contact endpoint

Same as plan v1 Task 5: `validateContact`, `isRateLimited` (3 per IP per 10 min), `sendMail` (Resend REST, from `Portfolio <onboarding@resend.dev>`, to `faigaojv027@gmail.com`, `reply_to` = the visitor), JSON and form-POST modes, `CONTACT_DRY_RUN`, exact copy. Unit tests at the boundaries. E2E: `js submit shows inline success`, `field errors`, `no-JS submit shows result page`, `send failure shows email fallback`. Commit `feat: contact form endpoint`.

### Task 6: SEO, icons, 404, README, deploy

**Files:** `public/{og.png,favicon.svg,favicon-32.png,apple-touch-icon.png,icon-512.png,robots.txt}`, `src/pages/404.astro`, `README.md`, `Base.astro` meta.

- [ ] Step 1: Generate `og.png` (1200×630, per spec §10) and the favicon PNGs from the logo with a small script (`scripts/make-icons.mjs` using `sharp`). Check the 16px render, and use a simplified mark if unreadable.
- [ ] Step 2: Write failing tests: unique titles; meta description; `og:image` resolves to 200; favicon links present; sitemap lists home, /projects and 7 project pages; `/nope` returns 404 with "Page not found", "That page doesn't exist." and "Back to home".
- [ ] Step 3: Implement. Step 4: Full suite + `npm run build && npm run check` pass.
- [ ] Step 5: JV connects the repo to Vercel and adds `RESEND_API_KEY`. Deploy a preview, run Lighthouse mobile on `/`, `/projects` and `/projects/marami-cafe` in both themes (95+), fix anything lower, then promote to production. Commit `feat: SEO, icons, 404, README`.

---

## JV's hand-offs

- Export the CV doc to PDF → `public/JV-Faigao-CV.pdf`.
- Get each client's OK on their English quote.
- Supply screenshots (any real data hidden) and a higher-resolution portrait if available.
- Create Vercel and Resend accounts (Resend with `faigaojv027@gmail.com`).
- Update `src/data/social.json` about once a month.
