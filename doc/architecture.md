# Trail Notes – Architecture & Codeflow

## 1. Project Overview

**Trail Notes** is a personal running portfolio and blog website for Rideep Gogoi. It is a Next.js 15 App Router application written in TypeScript and styled with Tailwind CSS v4. The site serves two distinct surfaces:

- `/` — Public portfolio page (server-rendered, statically generated)
- `/studio` — Private writer studio (password-gated, client-side only)

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) with Turbopack |
| UI Library | React 19 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| CMS (optional) | Decap CMS via `public/admin/` |
| Persistence | Browser `localStorage` / `sessionStorage` |
| Content | Markdown files in `content/blogs/` |

---

## 3. Directory Structure

```
WebsiteProject/
├── content/
│   └── blogs/               # Markdown blog posts (CMS source of truth)
│       ├── forest-road-long-run.md
│       ├── lake-loop-tempo.md
│       └── morning-ridge-reset.md
├── doc/                     # ← This documentation
├── public/
│   ├── admin/
│   │   ├── config.yml       # Decap CMS collection schema
│   │   └── index.html       # Decap CMS SPA entry point
│   ├── assets/
│   │   ├── rideep-gogoi.jpg
│   │   └── trail-notes-logo.png
│   └── uploads/             # CMS media upload target
├── src/
│   ├── app/
│   │   ├── globals.css      # Design tokens + global styles
│   │   ├── layout.tsx       # Root HTML shell + SEO metadata
│   │   ├── page.tsx         # Home page (/ route)
│   │   └── studio/
│   │       └── page.tsx     # Writer Studio (/studio route)
│   ├── components/
│   │   ├── BlogStudio.tsx   # Client: full post CRUD editor
│   │   ├── Footer.tsx       # Server: site footer
│   │   ├── Header.tsx       # Server: sticky navigation bar
│   │   ├── Hero.tsx         # Server: landing hero section
│   │   ├── JournalCard.tsx  # Server: expandable blog entry card
│   │   ├── PasswordGate.tsx # Client: sessionStorage auth wrapper
│   │   ├── PublishedPosts.tsx # Client: localStorage post reader
│   │   ├── RouteCard.tsx    # Server: trail route card
│   │   ├── SectionHeading.tsx # Server: reusable eyebrow + h2 + p
│   │   └── StatsCard.tsx    # Server: single statistic card
│   ├── data/
│   │   ├── blog.ts          # BlogPost type + localStorage key constants
│   │   └── trail.ts         # All static data + type definitions
│   └── lib/
│       └── cmsBlogs.ts      # Server-only: reads + parses markdown files
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 4. Rendering Model

All components default to **React Server Components** (RSC) in the App Router. Components that must access browser APIs (`localStorage`, `sessionStorage`, DOM events) are explicitly marked `"use client"`.

| Component | Rendering | Reason |
|---|---|---|
| `layout.tsx` | Server | Static HTML shell |
| `page.tsx` (home) | Server | Reads markdown files at request time |
| `studio/page.tsx` | Server | Static wrapper shell |
| `Header` | Server | Static nav, no browser APIs |
| `Footer` | Server | Static markup |
| `Hero` | Server | Static section |
| `SectionHeading` | Server | Pure presentational |
| `StatsCard` | Server | Pure presentational |
| `JournalCard` | Server | Pure presentational |
| `RouteCard` | Server | Pure presentational |
| `PublishedPosts` | **Client** | Reads `localStorage`, listens to `storage` event |
| `PasswordGate` | **Client** | Reads/writes `sessionStorage` |
| `BlogStudio` | **Client** | Full form state, `localStorage` read/write |

---

## 5. Data Architecture

### 5.1 Three Data Sources

```
┌─────────────────────────────────────────────────────────────────┐
│                         Home Page (/)                           │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Static Trail    │  │  CMS Markdown    │  │  Browser     │  │
│  │  Data            │  │  Files           │  │  localStorage│  │
│  │  src/data/trail  │  │  content/blogs/  │  │              │  │
│  │  .ts             │  │  *.md            │  │              │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
│           │                     │                    │          │
│           │  Fallback if        │  Parsed by         │          │
│           │  CMS is empty       │  getCmsBlogEntries │          │
│           │                     │  (server-side fs)  │          │
│           └──────────┬──────────┘                    │          │
│                      ▼                                │          │
│              JournalCard ×N                           │          │
│             (static/CMS blogs)                        │          │
│                                                       ▼          │
│                                             PublishedPosts       │
│                                            (client-published)    │
└─────────────────────────────────────────────────────────────────┘
```

**Source 1 – Static hardcoded data** (`src/data/trail.ts`):
- `stats[]` — Four running statistics shown in the About section
- `journalEntries[]` — Three fallback blog entries shown if no CMS files exist
- `routes[]` — Three trail route cards
- `gearItems[]` — Four gear/training items

**Source 2 – CMS Markdown files** (`content/blogs/*.md`):
- Parsed server-side by `getCmsBlogEntries()` in `src/lib/cmsBlogs.ts`
- Each file has YAML frontmatter (`title`, `date`, `category`, `route`, `distance`, `elevation`, `excerpt`) and a markdown body
- Sorted newest-first by `date` frontmatter field
- When CMS files exist they **replace** the static `journalEntries` fallback entirely

**Source 3 – Browser `localStorage`** (`trail-notes-published-posts` key):
- Posts created via BlogStudio (`/studio`) are stored as a JSON array
- Read client-side by `PublishedPosts` on the home page
- Rendered in a separate "Published by Rideep" subsection below the main blog cards
- Isolated per browser; not visible on other devices

### 5.2 Blog Priority Decision (in `page.tsx`)

```typescript
const cmsBlogEntries = getCmsBlogEntries();
// If any .md files exist under content/blogs/, use them.
// Otherwise fall back to the hardcoded journalEntries array.
const blogEntries = cmsBlogEntries.length > 0 ? cmsBlogEntries : journalEntries;
```

---

## 6. Page Codeflow

### 6.1 Home Page (`/`)

```
page.tsx (Server Component)
│
├─ getCmsBlogEntries()          // reads content/blogs/*.md at request time
│   └─ parseFrontmatter()       // parses YAML frontmatter + markdown body
│   └─ formatDisplayDate()      // "2026-03-08" → "08 Mar 2026"
│   └─ markdownToPlainText()    // strips # ** * [] markdown syntax
│
├─ <Header />                   // sticky nav, anchor links to page sections
├─ <Hero />                     // full-width landing with logo image
│
├─ #about section
│   ├─ <SectionHeading />       // "About" eyebrow + h2 + description
│   ├─ <Image /> (photo)        // race day photo with figcaption overlay
│   └─ stats.map(<StatsCard />) // 4 stat pills from trail.ts
│
├─ Featured Journey section     // decorative dark card with photo gradient
│
├─ #notes section
│   ├─ <SectionHeading />       // "Trail Blogs"
│   ├─ blogEntries.map(<JournalCard />) // CMS or fallback entries
│   └─ <PublishedPosts />       // client component: reads localStorage
│
├─ #routes section
│   ├─ <SectionHeading />       // "Routes"
│   └─ routes.map(<RouteCard />) // 3 route cards from trail.ts
│
├─ #gear section               // dark section, gearItems from trail.ts
│
├─ Gallery section             // 1 real photo + 3 placeholder cards
│
├─ #contact section            // mailto CTA button
│
└─ <Footer />
```

### 6.2 Writer Studio (`/studio`)

```
studio/page.tsx (Server Component shell)
│
├─ <Header />
├─ <PasswordGate>              // CLIENT: reads sessionStorage on mount
│   │
│   ├─ [locked]  → shows password form
│   │   └─ unlockStudio()     // validates against STUDIO_PASSWORD env var
│   │                         // writes "true" to sessionStorage on success
│   │
│   └─ [unlocked] → renders children + "Lock Studio" button
│       └─ <BlogStudio />     // CLIENT: full post editor
│           │
│           ├─ useEffect()    // on mount: reads localStorage posts + draft
│           ├─ updateField()  // controlled form field updater
│           ├─ readCurrentForm() // reads FormData from formRef
│           ├─ saveDraft()    // writes form to BLOG_DRAFT_STORAGE_KEY
│           ├─ publishPost()  // validates → builds BlogPost → prepends to array
│           │                 // → writes to BLOG_STORAGE_KEY → clears draft
│           ├─ deletePost()   // filters post out → writes back to localStorage
│           └─ exportBackup() // JSON.stringify posts → Blob → <a download>
│
└─ <Footer />
```

---

## 7. Component Contracts

### `SectionHeading`
```typescript
Props: { eyebrow: string; title: string; description: string; align?: "left" | "center" }
```
Renders a three-line block: small orange eyebrow label, large `<h2>`, and a grey description paragraph. `align="center"` adds `mx-auto text-center`.

### `StatsCard`
```typescript
Props: { stat: Stat }  // Stat = { label, value, detail }
```
Single metric card. Hover lifts the card.

### `JournalCard`
```typescript
Props: { entry: JournalEntry }
// JournalEntry = { date, routeName, distance, elevation, reflection, body }
```
Expandable card. The `reflection` text is always visible; the full `body` is hidden inside a native `<details>/<summary>` element, no JavaScript needed to toggle.

### `RouteCard`
```typescript
Props: { route: Route }
// Route = { name, distance, difficulty: "Easy"|"Moderate"|"Hard", terrain, location }
```
Dark card with CSS contour-line decoration. `difficultyStyles` maps each difficulty to a colour variant.

### `PasswordGate`
```typescript
Props: { children: React.ReactNode }
```
Renders a login form when locked; renders `children` plus a "Lock Studio" button when unlocked. Auth state persists only for the browser tab session (`sessionStorage`). Password sourced from `NEXT_PUBLIC_TRAIL_NOTES_STUDIO_PASSWORD` env var, defaulting to `"trailnotes2026"`.

### `BlogStudio`
No props. Manages three pieces of state:
- `form: BlogForm` — current editor field values
- `posts: BlogPost[]` — array of published posts from localStorage
- `message: string` — status/feedback string shown to the user

### `PublishedPosts`
No props. Reads `localStorage` once on mount (inside a `setTimeout(fn, 0)` to defer past server/client hydration). Also subscribes to the `"storage"` window event to pick up changes made in other browser tabs.

---

## 8. LocalStorage Key Map

| Key | Written by | Read by | Content |
|---|---|---|---|
| `trail-notes-published-posts` | `BlogStudio.publishPost()`, `BlogStudio.deletePost()` | `BlogStudio`, `PublishedPosts` | `BlogPost[]` JSON array |
| `trail-notes-current-draft` | `BlogStudio.saveDraft()` | `BlogStudio` useEffect | `BlogForm` JSON object |
| `trail-notes-studio-unlocked` | `PasswordGate.unlockStudio()` | `PasswordGate` useEffect | `"true"` string (sessionStorage) |

Note: `trail-notes-studio-unlocked` uses **`sessionStorage`** (tab-scoped), the rest use **`localStorage`** (origin-scoped, persists across tabs and sessions).

---

## 9. CMS Integration

The site ships with [Decap CMS](https://decapcms.org/) configuration at `public/admin/`:

- `index.html` — Standalone SPA loaded at `/admin`. No Next.js involvement; served as a static file.
- `config.yml` — Defines one collection: `blogs`. Schema mirrors the `JournalEntry` / `BlogPost` shapes. The backend is `git-gateway` (requires Netlify Identity or similar), with `local_backend: true` for local development. Created files land in `content/blogs/` and are picked up automatically on the next server render.

---

## 10. Styling System

Tailwind CSS v4 is configured with CSS-first theme variables in `globals.css`:

| CSS Variable | Hex | Usage |
|---|---|---|
| `--deep-forest` | `#0f1f17` | Primary dark green – backgrounds, text |
| `--trail-green` | `#2e5a43` | Secondary green – links, labels |
| `--soft-sage` | `#a7c4a0` | Light green – subtle borders, accents |
| `--warm-sand` | `#f3f1e8` | Off-white – cards, backgrounds |
| `--energy-orange` | `#ff6b00` | Accent orange – eyebrows, CTAs, hover |
| `--charcoal` | `#111111` | Body text |

Two custom CSS utility classes:
- `.trail-map-bg` — Grid line pattern on the Hero section mimicking a topographic map
- `.contour-lines` — Radial-gradient rings on `RouteCard` mimicking elevation contours

Fonts: `Inter` (body), `Poppins` (headings via `--font-heading`).

---

## 11. Key Design Decisions

1. **No client-side routing needed** — the site is a single long-scroll page; all nav links are anchor hash links (`/#about`, `/#routes`). The only second route is `/studio`.

2. **`setTimeout(fn, 0)` pattern** — Both `PublishedPosts` and `PasswordGate` delay their `localStorage`/`sessionStorage` reads by one tick. This prevents hydration mismatches: the server renders empty/locked state, and the client reconciles immediately after mount.

3. **CMS-or-fallback swap** — The blog section shows CMS content when available and falls back to hardcoded data, making the site presentable before any CMS posts exist.

4. **No external state library** — All client state is local component state (`useState`) or browser storage. No Redux, Zustand, or Context.

5. **Native `<details>/<summary>`** — Blog body expansion uses the HTML primitive rather than JavaScript toggle state, keeping JournalCard and PublishedPosts as lean as possible.

6. **`crypto.randomUUID()` with fallback** — `createPostId()` prefers the native Web Crypto API and falls back to a `Date.now()` string for environments where it is unavailable.

---

## 12. Further Reading

- [CMS Setup, Netlify Hosting & Publishing Guide](cms-and-hosting-setup.md) — Step-by-step instructions for pushing to GitHub, deploying to Netlify, enabling Netlify Identity + Git Gateway, and publishing blog posts through Decap CMS.
