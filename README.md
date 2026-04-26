# Alan Ansari — Portfolio

Production-ready Next.js port of the `portfolio/v1-sidebar.html` handoff design, built with the App Router, Tailwind, Framer Motion, and Sanity. Ships with live GitHub + LeetCode data: a combined activity graph (heatmap rows) and recent signals from public APIs (fetched on each home page request).

## Tech

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + raw CSS variables (design tokens from `tokens.css`)
- **Animations**: Framer Motion (scroll reveal, card hover, theme toggle)
- **CMS**: Sanity (schemas + embedded Studio at `/studio`)

## Project layout

```
app/
  layout.tsx           # Root layout, fonts, theme provider
  page.tsx             # Home page — composes all sections
  globals.css          # Design tokens + base + component classes
  studio/[[...tool]]/  # Embedded Sanity Studio
components/
  Sidebar.tsx          # Sticky left rail with scroll-spy
  sections/            # Hero, About, Now, Experience, Skills, Projects, Contact, Footer
  ui/                  # Reveal, Chip, SectionHead, ThemeToggle, icons
  ThemeProvider.tsx    # Light/dark context (localStorage-persisted)
lib/
  content.ts           # Sanity fetchers w/ graceful fallbacks
  handles.ts           # Resolve GitHub / LeetCode logins from social URLs
  activity.ts          # Activity graph + live stats merge for the home page
  github.ts            # GitHub REST + GraphQL (contributions, public events)
  leetcode.ts          # LeetCode GraphQL (stats, calendar, recent solves)
  cn.ts
sanity/
  client.ts            # Published read client
  env.ts
  queries.ts           # GROQ
  schemas/             # profile, project, experience, skillCategory, social
  fallback.ts          # Static design content (used when Sanity isn't set up)
  types.ts
sanity.config.ts       # Studio config
tailwind.config.ts     # Token mappings
```

## Run locally

```bash
cp .env.example .env.local
# Fill in Sanity + GitHub + LeetCode vars (optional; the site still renders without them)
# Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to enable the contact form

npm install
npm run dev
# http://localhost:3000      — portfolio
# http://localhost:3000/studio — Sanity Studio
```

Everything on the home page is pre-populated with the handoff design content via `sanity/fallback.ts`, so you can preview the full page immediately without connecting Sanity.

## Connect Sanity

1. Create a project at [sanity.io/manage](https://sanity.io/manage).
2. Set the following in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your id>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Run `npm run dev` and open `/studio`. Create one document of each type:
   - **Profile** (singleton — name, headline, facts, etc.)
   - **Experience** (one per role — ordered via `order`)
   - **Skill Category** (one per group)
   - **Project** (title, description, viz style, tech chips)
   - **Social link** (email, GitHub, LinkedIn, LeetCode)
4. Publish each document. Sanity reads use `revalidate: 0` so content updates on the next request after you publish.

## GitHub + LeetCode on the home page

`lib/activity.ts` (`getLiveStats`) loads social handles from Sanity (or fallbacks), then calls GitHub and LeetCode on the server. Static numbers in `sanity/fallback.ts` only fill gaps when an API call fails.

- **GitHub** — repo count, merged PRs, contribution total from the calendar window, top languages, **contribution calendar** (GraphQL when `GITHUB_TOKEN` is set; otherwise public events), and **public events** for the signals card. Login from the GitHub social URL, else `GITHUB_USERNAME`.
- **LeetCode** — contest rating, ranking, solve counts, **submission calendar** (heatmap weeks aligned to GitHub), and **recent accepted submissions** for signals. Username from the LeetCode social URL (`/u/username` recommended), else `LEETCODE_USERNAME`.

GitHub / LeetCode `fetch` calls use Next.js `revalidate` hints where applicable so repeated loads can be cached briefly at the data layer.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import into [Vercel](https://vercel.com/new).
3. Add the env vars from `.env.example` (add `GITHUB_TOKEN` as a secret if you use it).
4. First deploy.
5. Configure the Vercel project → **Settings → Domains** if using a custom domain (e.g. `alanansari.dev`).

## Design fidelity notes

- Tokens from `tokens.css` are ported verbatim into `app/globals.css` (OKLCH colors, easing curves, radius, shadow stack).
- Section structure and spacing match the handoff (`120px` vertical padding on desktop, `80px 80px` horizontal).
- The sidebar uses an IntersectionObserver scroll-spy, mirroring the prototype.
- Each project card has its own visualization (`buzrr` bars, `benefi` chart, `jsgamez` grid, `samriddhi` conic) implemented in CSS.
- Theme toggle persists via `localStorage` (key `portfolio-theme`) and hydrates before paint via an inline script in `<head>` — no dark-mode flash.

## Scripts

| Command          | Description                               |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start local dev server (Next + Studio)    |
| `npm run build`  | Production build                          |
| `npm run start`  | Start built server                        |
| `npm run lint`   | ESLint (Next config)                      |
| `npm run typecheck` | Type-check without emit                 |
