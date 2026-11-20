# JV Faigao Portfolio

Personal portfolio of John Vincent "JV" Faigao. Astro (static pages + one server route for the contact form), deployed on Vercel.

Design spec: [docs/superpowers/specs/2026-11-20-portfolio-design.md](docs/superpowers/specs/2026-11-20-portfolio-design.md) · Plan: [docs/superpowers/plans/2026-11-20-portfolio.md](docs/superpowers/plans/2026-11-20-portfolio.md)

## Run it

```bash
npm install
npx playwright install chromium   # once, for e2e tests and icon generation
npm run dev                       # http://localhost:4321
npm run build                     # production build
npm test                          # unit tests (Vitest)
npm run test:e2e                  # browser tests (Playwright, starts its own dev server)
npm run check                     # type check
```

## Things you update by hand

| What | Where |
|---|---|
| Facebook / TikTok follower counts (about once a month) | `src/data/social.json` (also bump `updatedAt`) |
| Tech stack | `src/data/stack.json` (`icon` = a [Simple Icons](https://simpleicons.org) slug, optional) |
| A project | `src/content/projects/<slug>.md` (frontmatter + "The problem" / "What I built") |
| Project screenshots | put images in `src/assets/projects/<slug>/`, list them under `screenshots:` in the project file (the section stays hidden while the list is empty) |
| "How it works" diagram | `src/components/diagrams/index.ts` |
| CV | `public/JV-Faigao-CV.pdf` (the Download CV buttons link here) |
| Favicons and link preview card | run `node scripts/make-icons.mjs` after changing `public/logo.svg` or the photo |

## Contact form

`POST /api/contact` sends mail through the [Resend](https://resend.com) REST API to faigaojv027@gmail.com, with the visitor as `reply_to`.

Environment variables (Vercel → Project → Settings → Environment Variables):

| Name | Value |
|---|---|
| `RESEND_API_KEY` | API key from Resend (required in production) |
| `CONTACT_DRY_RUN` | set to `1` only for local tests: pretends to send and skips the rate limit |

Without JavaScript the form still works: the server redirects to `/contact-result`. Spam protection: a hidden honeypot field and 3 messages per IP per 10 minutes (in memory, per server instance).

## Deploy

1. Import the GitHub repo in Vercel (framework: Astro).
2. Add `RESEND_API_KEY`.
3. If the final address is not `https://jvfaigao-portfolio.vercel.app`, change `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt`.
