# Trail Notes

Minimal, static-first running portfolio website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```

## GitHub Pages Deployment

This project is configured for a static export (`output: "export"` in
`next.config.ts`), with `basePath: "/TrailNotes"` set for hosting at
`https://<username>.github.io/TrailNotes/`.

To build the static site into `docs/` (served from the `main` branch's
`/docs` folder via GitHub Pages settings):

```bash
npm run build:pages
```

Then enable GitHub Pages in the repo settings: Settings → Pages → Source:
`Deploy from a branch` → Branch: `main` / `docs`.

If the repo name changes, or the site is hosted at a custom domain or the
root of a user/org page (`https://<username>.github.io/`), update or remove
the `basePath` (and `images.unoptimized` stays required either way) in
`next.config.ts` and rebuild.

## Structure

- `src/app` contains the App Router page, layout, metadata, and global styles.
- `src/components` contains reusable UI components.
- `src/data/trail.ts` contains placeholder stats, journal entries, routes, and gear content.
- `content/blogs` contains CMS-managed Markdown blog posts.
- `public/admin` contains the Decap CMS admin app and CMS configuration.
- `public/assets/trail-notes-logo.png` contains the Trail Notes logo used in the header, hero, and footer.
- `public/assets/rideep-gogoi.jpg` contains the client race photo used in the About, feature, and Gallery sections.

## CMS

The project uses Decap CMS.

Open `/admin` to manage blog posts. The admin page is intentionally not linked from public navigation.

Blog posts are saved as Markdown files in `content/blogs`. Each post supports title, publish date, category, route/event, distance, elevation, short summary, and full blog body. The homepage reads those Markdown files at build time and renders them as expandable blog cards.

For production, deploy on a platform that supports Git Gateway authentication, such as Netlify:

1. Push this project to a Git repository.
2. Deploy the site.
3. Enable Identity.
4. Enable Git Gateway.
5. Invite the client as an Identity user.
6. The client edits posts at `/admin`.

For local CMS testing, Decap’s `local_backend: true` is enabled in `public/admin/config.yml`; run a Decap local backend proxy separately if you want local write access from `/admin`.

## Writer Studio

Open `/studio` directly to draft, preview, save, publish, delete, and export blog posts without editing code. The link is intentionally hidden from public navigation.

The studio is protected by a client-side password gate. The default local password is `trailnotes2026`; override it with `NEXT_PUBLIC_TRAIL_NOTES_STUDIO_PASSWORD` if needed.

This is now a fallback local utility. For real client publishing, use `/admin` so posts are committed as Markdown through the CMS.
