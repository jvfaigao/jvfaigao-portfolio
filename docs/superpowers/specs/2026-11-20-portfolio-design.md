# JV Faigao Portfolio: Design (v2)

Date: 2026-11-21 · Status: approved by JV (preview approved 2026-11-21)
Visual reference: the approved preview canvas "JV Faigao Portfolio — Preview" (Home, Projects, Marami Cafe page, phone screens, link preview card, favicon).

v2 replaces v1's cool-blue "schematic" look and its no-client-names rule. Client names are now allowed: JV confirmed every client agreed.

## 1. Intent

A personal portfolio for John Vincent "JV" Faigao, used for OJT applications and then for full-time web development roles.

The one thing a visitor should remember: **"He builds complete systems that real people use every day."**

The home page is about JV as a person. Projects live on their own page. Claims stay honest: no skill bars, no "expert," and every number and quote is real.

## 2. Goals, non-goals, anti-goals

**Goals**
- In 30 seconds the visitor knows who JV is, sees proof (4 systems in production, ~500 users on the largest, CPEYESTA champion), and can download the CV.
- Projects show real clients, live links, a result, and a client quote.
- It works as well on a phone as on a laptop, with a bottom navigation bar on phones.
- Adding a project means adding one Markdown file and its images.

**Non-goals**
- Blog, CMS, analytics dashboard, multiple languages.

**Anti-goals**
- Invented numbers, invented testimonials, or unverified claims.
- Templated "AI" visuals: gradient blobs, glassmorphism, cursor followers, typing hero, skill bars, logo clouds.

## 3. Pages

```
/                      Home: JV (hero, how I work, testimonial, tech stack, about, beyond code, contact)
/projects              All projects, grouped
/projects/<slug>       One page per project
/api/contact           Contact form endpoint (server, POST only)
/JV-Faigao-CV.pdf      CV download
/404                   Not found
```

## 4. Visual system

### Color
| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#000000` | `#FFFFFF` | Page |
| `--surface` | `#0F0F0F` | `#F4F4F4` | Cards, thumbnails, fields |
| `--surface2` | `#1C1C1C` | `#E4E4E4` | Placeholders |
| `--text` | `#FFFFFF` | `#000000` | Text |
| `--muted` | `#A3A3A3` | `#555555` | Secondary text |
| `--line` | `#222222` | `#E2E2E2` | Hairlines |
| `--red` | `#E3261C` | `#E3261C` | Fills, large display text, primary buttons (white text) |
| `--redtext` | `#FF5A4F` | `#C81E15` | Small red text and links (passes AA on its background) |
| `--navbg` | `#141414` | `#F3F3F3` | Phone bottom nav bar |

### Type
- **Big Shoulders Display 800** for display words: FAIGAO, section titles (HOW I WORK, TECH STACK, ABOUT, BEYOND CODE, LET'S WORK TOGETHER, PROJECTS), CHAMPION, project page titles. Uppercase.
- **Schibsted Grotesk 400/500/600** for everything else. Body 17px, line-height 1.6.
- Both self-hosted.

### Brand assets
- **Logo:** JV's monogram (J, V and cross in an inverted triangle), traced to a single-color SVG (`fill: currentColor`). Used in the header (36px), footer (28px), favicon, and link preview card.
- **Photo:** JV's black-and-white portrait with the background removed (transparent PNG/WebP). The supplied original is 515×590. A larger original should replace it when available.

### Theme
Dark by default; a toggle switches to light and is remembered. An inline head script sets the theme before paint.

### Motion
- On load, the FAIGAO word and the photo rise once (about 0.9–1.1s).
- The phone bottom-nav bubble slides between items (transform, with a small stretch and an icon cross-fade).
- The phone bottom nav slides away while scrolling down and returns on scroll up, at the top and end of the page, and on keyboard focus.
- Every heading, paragraph, bullet and card in the page body rises in (about 0.7s) when it scrolls into view, one after another when several enter together. The hero text rises in on load after FAIGAO and the photo. Not the contact form or the footer. Works in every browser (IntersectionObserver, Safari included); without JavaScript or with reduced motion the text simply shows, and if the script stops halfway everything shows after 2.5s.
- Project demo clips play muted only while on screen.
- "How it works" diagrams draw in once, in flow order (boxes rise, arrows extend), when they scroll into view.
- Hover (desktop): project thumbnails zoom slightly; ↗ arrows nudge.
- Contact form: spinner on the button while sending; a check mark on success.
- Theme toggle: sun and moon spin and cross-fade; the page colours cross-fade where the View Transitions API exists.
- View transitions between the project list and project pages.
- Everything is off under `prefers-reduced-motion`.

## 5. Header and navigation

- **Desktop:** logo + "JV Faigao" (home link) on the left. On the right: Projects, About, Contact, a red-outlined **Download CV** pill, and the theme toggle.
- **Phones (≤640px):** logo + name, a small solid-red **Download CV** pill, and the theme toggle. The text links are hidden.
- **Phone bottom nav (≤640px):** fixed to the bottom, 4 items: **Home, Projects, About, Contact**, each with an icon and a small label. The active item's icon sits in a raised red circle over a notch in the bar. The circle slides to the tapped item. On Home, the active item also follows scroll position (hero → Home; how I work / testimonial / tech stack / about / beyond code → About; contact → Contact). On Projects and project pages, Projects is active. Bar color follows the theme. Respects the safe-area inset. The page footer gets extra bottom padding so nothing is hidden.

## 6. Home page

1. **Hero.** A full-viewport-width red **FAIGAO** sits behind JV's photo. It is sized to span the width exactly (an SVG text element with `textLength`; at font-size 417 the word measures 1000 units wide) and fades from solid at the top to transparent near the bottom. The photo's bottom edge fades into the page.
   - Left: "Hi, I'm JV." / "Computer Engineering student who builds complete systems that real people use every day." / **View projects** (solid red pill) / Contact (underlined link).
   - Right: **4** systems in production · **~500** users on the largest · **CHAMPION** CPEYESTA System Making 2026.
   - Phones: FAIGAO across the top, photo overlapping below it, then the intro, then the stats in a row.
2. **How I work.** 01 Understand, 02 Plan, 03 Build, 04 Support, one sentence each.
3. **Testimonial.** A large red quote mark, then: "We save a lot of time computing salaries now. And we can always check if our workers really showed up for work." — Owner, Urban Towns · Attendance and Payroll System.
4. **Tech stack.** Four groups, each with a category icon: Languages (TypeScript, JavaScript, Python, PHP, C++, HTML and CSS), Frontend (React, Vite, Progressive web apps, Responsive mobile-first UI), Backend and data (Firebase, Supabase and PostgreSQL, Vercel serverless functions, Dexie.js for offline-first), Tools and hosting (Git and GitHub, Vercel, Cloudflare Pages, VS Code). In the build, each item shows its monochrome Simple Icons logo where one exists.
5. **About.** The paragraph about URS (graduating April 2027) and building systems for churches, cafés, construction sites and sports facilities, plus a line about the Arduino RC car and 3D-printed robotic arm. Beside it: Education (BS Computer Engineering, University of Rizal System, Antipolo · April 2027) and Recognition (Champion, CPEYESTA System Making 2026, with FaceAttend; BCC 2026 × Binance Academy Hackathon participant, with AmbagPay, plus the certificate link).
6. **Beyond code.** "I'm also a musician. I play four instruments:" then PIANO DRUMS GUITAR BASS as large display words, alternating white and red. Two cards follow:
   - Facebook: Jv Faigao, https://www.facebook.com/JvFaigao/, 69.5K followers
   - TikTok: @jv.faigao, https://www.tiktok.com/@jv.faigao, 23.3K followers

   Counts come from a data file that JV updates by hand (see §9).
7. **Let's work together.** A full-width red band with LET'S WORK TOGETHER, the email faigaojv027@gmail.com, a Download CV outline button, and the contact form (name, email, message). No OJT-hours line.
8. **Footer.** Logo, © year, email, GitHub ↗, LinkedIn ↗ (monochrome logos in the build).

## 7. Projects page

The heading is a large red PROJECTS with the line "Systems I've built for real organizations, plus a few for competitions and school." Projects are grouped as follows:

| Group | Project | Meta | Live link |
|---|---|---|---|
| In production | JA1 Church Management System | About 500 users | https://ja1-attendance.web.app |
| In production | Marami Cafe POS and Online Ordering | In daily use | https://marami-cafe-pos-system.vercel.app/order |
| In production | Urban Towns Attendance and Payroll | 20–50 workers daily | https://urban-towns-attendance.web.app/ |
| In production | Degz Athletic Club Booking System | In use by customers | https://degz-athletic-club.pages.dev/ |
| Other work | FaceAttend | Champion, CPEYESTA 2026 | https://faceattend-kohl.vercel.app/ |
| Other work | AmbagPay | Hackathon, November 2026 | repo https://github.com/jvfaigao/AmbagPay |
| Other work | Automated Attendance and Payroll System (Thesis) | Team project, frontend | none |

Each row shows a thumbnail, the name (linking to the project page), a one-line summary, a status (red dot "In production" or a label), and a **Visit site ↗** link where one exists. The page ends with the red LET'S WORK TOGETHER band.

## 8. Project page template

Order: All projects link → large display title + status → summary → meta (role · year · stack · live link) → **Result** (a large red display phrase plus one plain sentence) → The problem / What I built → **client quote** → How it works (a diagram; wide boxes and arrows on desktop, a vertical flow under 820px) → Screenshots (hidden when there are none) → "Interested in working together?" + Download CV / Send a message.

Results and quotes (all from JV's clients or known facts; JV gets each client's OK on the English wording):

| Project | Result | Quote |
|---|---|---|
| JA1 | About 500 users across multiple church branches | "We can now keep track of who attends every Sunday and manage our members better. No more listing attendees by hand. One QR scan and their attendance is in." — Admin, JA1 Church |
| Marami | IN DAILY USE · Every printed bill is now tied to a recorded sale, and stock is counted against what was actually sold. | "Our POS is easier to use now because the features aren't limited anymore. Ordering is faster since we have online orders, and we don't check the inventory by hand as much. The kitchen display helps a lot too. Our kitchen is far from the counter, so no more going up and down." — Owner, Marami Cafe |
| Urban Towns | 20–50 workers clock in daily by QR; payroll exports straight to CSV | "We save a lot of time computing salaries now. And we can always check if our workers really showed up for work." — Owner, Urban Towns |
| Degz | Customers book courts and pay deposits online through GCash | "Booking a court, training or a recovery session is much faster now, and our schedule is more organized. Before, we wrote everything on paper, and sometimes two clients booked the same slot without the owner or staff knowing. That doesn't happen anymore." — Owner, Degz Athletic Club |

Diagram content follows the v1 descriptions (Marami: Online order → POS → Kitchen display; POS → Inventory → Cloud sync).

## 9. Data JV maintains

- `src/data/social.json`: Facebook and TikTok names, links and follower counts, plus an `updatedAt` date. JV updates it about once a month. Automatic updates through the Facebook Graph API (Page token) and the TikTok Display API (`user.info.stats`) are a possible later addition, not part of this build.
- Project Markdown files: results, quotes and screenshots.
- `public/JV-Faigao-CV.pdf`: an export of the CV doc.

## 10. Link preview card and favicon

- **OG image (1200×630):** black background, a fading red FAIGAO across the top, the photo at the right, the logo + "JV Faigao" at top left, and "Web Developer · Antipolo City" plus the headline at bottom left. One per site; project pages may reuse it.
- **Favicon set:** the white logo on a black rounded square at 16, 32, 180 (apple-touch) and 512 px. If 16px is unreadable, use a simplified mark at that size.

## 11. Technical design

| Part | Choice |
|---|---|
| Framework | Astro (latest stable), TypeScript strict |
| Styling | Plain CSS with the tokens above, no CSS framework |
| Fonts | `@fontsource/big-shoulders-display` (800), `@fontsource-variable/schibsted-grotesk` |
| Content | Astro content collections (`projects`), JSON data (`social`, `stack`) |
| Images | `astro:assets` |
| Transitions | Astro view transitions |
| Icons | `simple-icons` (monochrome brand logos) plus inline SVG category and nav icons |
| Contact | Astro on-demand endpoint on Vercel plus Resend REST API to faigaojv027@gmail.com; honeypot, validation, rate limit, no-JS fallback |
| Hosting | Vercel on a free `*.vercel.app` address; repo `jvfaigao/portfolio` (public) |
| SEO | Sitemap, per-page title and description, OG image, canonical URLs |
| Tests | Vitest (logic), Playwright (browser) |

Quality bar: Lighthouse 95+ on mobile; WCAG AA in both themes; visible focus; no horizontal scroll from 360px; no layout shift.

## 12. Decisions log

- 2026-11-20: Astro chosen over React+Vite and Next.js.
- 2026-11-20: Black/white/red direction with the FAIGAO hero chosen over the blueprint, showcase and editorial options.
- 2026-11-20: Home is about JV; projects moved to their own page.
- 2026-11-20: Mobile bottom nav with Home, Projects, About, Contact; CV in the top bar; nav color follows the theme.
- 2026-11-20: OJT-hours line removed.
- 2026-11-21: Real client names allowed (clients agreed); results from known facts; testimonials from JV's report of what clients said, confirmed by clients.
- 2026-11-21: Follower counts updated manually.
- 2026-11-21: Real screenshots and short demo clips from JV's screen recordings, personal data blurred; the Projects page uses the first screenshot instead of wireframes. CV published with phone number (JV approved).
- 2026-11-21: Scroll reveal limited to the elements listed under Motion; bottom nav hides on scroll down.
- 2026-11-21: JV asked for text to animate too: reveal extended to text groups (not every line), which narrows the "fade-in on every section" anti-goal to whole sections fading as one block.
- 2026-11-21: The scroll-linked reveal showed no motion on JV's iPhone (Safari lacks scroll timelines). Replaced with a time-based reveal on all body text, at JV's request; the "fade-in on every section" anti-goal is dropped.
- 2026-11-21: FaceAttend was built by a team of two (JV confirmed after the award photo showed two awardees): role is "Developer, team of 2". A Recognition section shows the ACCESS awarding photo and the scanned certificate; About links to it.
- 2026-11-21: Home has no divider lines between its sections; it reads as one continuous page. Project pages keep theirs.
