# Decap CMS Setup, Netlify Hosting & Publishing Guide

This document is a complete end-to-end walkthrough for:
1. Pushing the project to GitHub
2. Deploying to Netlify (free tier)
3. Enabling Netlify Identity + Git Gateway so Decap CMS can write blog posts
4. Using the CMS to publish posts that appear on the live site
5. Local development workflow with the CMS proxy

---

## Part 1 – GitHub Repository

### Why GitHub is needed
Decap CMS uses the **git-gateway** backend. When you publish a post in the CMS, it opens a pull request (or commits directly) to your GitHub repository. Netlify then rebuilds the site automatically. No database, no server — posts are just Markdown files in `content/blogs/`.

### Step 1 — Create a GitHub account
If you already have one, skip to Step 2.

1. Go to **github.com** and click **Sign up**.
2. Choose a username, enter your email, set a password.
3. Verify your email address.

### Step 2 — Create a new repository
1. After logging in, click the **+** icon (top right) → **New repository**.
2. Fill in:
   - **Repository name:** `trail-notes` (or any name you like)
   - **Visibility:** `Public` ← required for Netlify's free Git Gateway
   - Leave all other options unchecked
3. Click **Create repository**.

### Step 3 — Push the project to GitHub
Open the **Terminal** inside the project folder (or VS Code's built-in terminal) and run these commands one at a time:

```bash
# Initialise git in the project folder (only needed if not already a repo)
git init

# Tell git which branch to call main
git checkout -b main

# Stage every file
git add .

# Make the first commit
git commit -m "Initial commit: Trail Notes website"

# Connect your local folder to the GitHub repo you just created
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

After the push completes you should see all your files on `github.com/YOUR_USERNAME/YOUR_REPO_NAME`.

---

## Part 2 – Netlify Hosting

Netlify reads your GitHub repository, runs `npm run build`, and publishes the output. Every time you push new commits (including blog posts saved by the CMS) it rebuilds automatically.

### Step 4 — Create a Netlify account
1. Go to **netlify.com** and click **Sign up**.
2. Choose **Sign up with GitHub** — this links your accounts and lets Netlify read your repos.
3. Authorise the Netlify app when GitHub asks.

### Step 5 — Import the project

1. On the Netlify dashboard click **Add new site** → **Import an existing project**.
2. Click **GitHub**.
3. Find and select your `trail-notes` repository.
4. Netlify detects Next.js automatically. Confirm the build settings:

   | Setting | Value |
   |---|---|
   | **Build command** | `npm run build` |
   | **Publish directory** | `.next` |
   | **Node version** | `20` (set via Environment Variables if needed — see below) |

5. Click **Deploy site**.

Netlify will build the site. The first build takes ~2 minutes. When it finishes you get a URL like `https://quirky-name-123456.netlify.app`.

### Step 6 — Set a custom domain (optional)

1. In the site dashboard go to **Domain management** → **Add a domain**.
2. Enter your domain (e.g. `trailnotes.run`) and follow the DNS instructions.
3. Netlify provisions a free SSL certificate automatically via Let's Encrypt.

### Step 7 — Set Node version (if the build fails)

If the build fails with a Node version error:

1. In the Netlify dashboard go to **Site configuration** → **Environment variables**.
2. Click **Add a variable** and set:
   - **Key:** `NODE_VERSION`
   - **Value:** `20`
3. Trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**.

### Step 8 — Update `metadataBase` in `layout.tsx`

Once your site is live, replace the placeholder URL with your real Netlify URL so Open Graph images resolve correctly:

Open [src/app/layout.tsx](../src/app/layout.tsx) and change line 9:

```typescript
// Before
metadataBase: new URL("https://trailnotes.example"),

// After (use your actual Netlify or custom domain)
metadataBase: new URL("https://your-site-name.netlify.app"),
```

Commit and push — Netlify will rebuild automatically.

---

## Part 3 – Netlify Identity + Git Gateway

These two Netlify services are what let the CMS log you in and write commits back to GitHub without exposing your personal GitHub credentials.

### Step 9 — Enable Netlify Identity

1. In the Netlify site dashboard click **Integrations** (top menu) → search for **Identity** → click **Enable**.

   Alternatively: go to **Site configuration** → **Identity** → **Enable Identity**.

2. Under **Registration preferences**, change from **Open** to **Invite only**.
   This means only people you explicitly invite can log in to the CMS.

3. Under **External providers** you can optionally add Google or GitHub login.

### Step 10 — Enable Git Gateway

Git Gateway is the service that creates commits on your behalf.

1. Still inside **Identity** settings, scroll down to **Services**.
2. Click **Enable Git Gateway**.
3. Netlify will ask you to authorise it on GitHub — click **Authorise**.

### Step 11 — Invite yourself as a CMS user

1. Go to **Identity** → **Invite users**.
2. Enter your email address and click **Send invite**.
3. Check your email for the invite link. Click **Accept the invite**.
4. You will be redirected to your live site. A pop-up from Netlify Identity will appear asking you to set a password. **Set a strong password.** This is your CMS login password — separate from your Netlify account.

> **Important:** If the pop-up does not appear after clicking the invite link, it means the Netlify Identity widget script in `public/admin/index.html` is not loading. Check that the site deployed successfully and try the link again.

---

## Part 4 – Decap CMS Configuration (Already Done)

Your project already has the CMS configured. Here is what each file does and what you might need to update.

### `public/admin/index.html`

This is a standalone HTML page served at `/admin` on your live site. It loads:
- **Netlify Identity Widget** — handles the login popup
- **Decap CMS script** — the full editor UI

No changes needed unless you want to pin a specific Decap CMS version.

### `public/admin/config.yml`

This defines the CMS backend and the blog post schema. The current configuration:

```yaml
backend:
  name: git-gateway   # uses Netlify Identity + Git Gateway
  branch: main        # commits go to the main branch

local_backend: true   # enables the local proxy (see Part 5)
publish_mode: editorial_workflow  # posts go through Draft → Review → Published states
```

**One change required:** update `site_url` and `display_url` to your real URL:

```yaml
site_url: "https://your-site-name.netlify.app"
display_url: "https://your-site-name.netlify.app"
```

Commit and push this change.

---

## Part 5 – Publishing a Blog Post (Live CMS)

Once Parts 1–4 are complete:

### Step 12 — Open the CMS

1. Go to `https://your-site-name.netlify.app/admin`
2. The Netlify Identity login popup appears. Enter the email and password you set in Step 11.
3. You are now inside the Decap CMS editor.

### Step 13 — Create a new blog post

1. Click **Blog Posts** in the left sidebar.
2. Click **New Blog Post**.
3. Fill in the fields:

   | Field | What to write |
   |---|---|
   | **Title** | The post headline, e.g. "What the marathon taught me" |
   | **Publish Date** | Select the date |
   | **Category** | Choose from the dropdown |
   | **Route or Event** | e.g. "Tata Mumbai Marathon" (optional) |
   | **Distance** | e.g. "42.2 km" (optional) |
   | **Elevation** | e.g. "180 m" (optional) |
   | **Short Summary** | One or two lines shown as the card preview |
   | **Full Blog** | Write the full post in the markdown editor |

4. Click **Save** (top right). This saves the post as a **Draft**.

### Step 14 — Publish the post

With `editorial_workflow` enabled, posts move through three states:

```
Draft  →  In Review  →  Ready  →  Published
```

1. After saving as a draft, click the **Status** dropdown (top of the editor) and change it to **In Review**, then to **Ready**.
2. Click **Publish** → **Publish now**.

### What happens next

Decap CMS commits a new `.md` file to `content/blogs/` in your GitHub repository. Netlify detects the commit, triggers a rebuild (~60 seconds), and the post appears on your live site automatically.

---

## Part 6 – Local Development with the CMS

During local development you can test the CMS editor without pushing real commits to GitHub. The `local_backend: true` setting in `config.yml` enables a local proxy that writes files directly to your `content/blogs/` folder.

### Step 15 — Start the Decap CMS proxy

Open **two** terminal windows in the project folder.

**Terminal 1 — CMS proxy:**
```bash
npx decap-server
```

This starts a local proxy on `http://localhost:8081`. Leave it running.

**Terminal 2 — Next.js dev server:**
```bash
npm run dev
```

This starts the Next.js site on `http://localhost:3000`.

### Step 16 — Open the local CMS

Navigate to `http://localhost:3000/admin`

The CMS loads in local mode (no login required). Any post you create here writes a `.md` file directly into `content/blogs/` on your machine. The Next.js dev server picks it up automatically and the post appears on `http://localhost:3000`.

### Turning off local backend for production

`local_backend: true` in `config.yml` is safe to leave on — Decap CMS only activates it when the proxy server is running on port 8081. On Netlify (where there is no proxy), it falls back to the git-gateway backend automatically.

---

## Part 7 – How Blog Posts Appear on the Site

This diagram shows the full flow from typing a post to seeing it on the live website:

```
CMS Editor (/admin)
     │
     │  Saves as .md file with YAML frontmatter
     ▼
content/blogs/YYYY-MM-DD-slug.md  (in GitHub)
     │
     │  Netlify detects commit, triggers build
     ▼
getCmsBlogEntries()  (runs at build time in src/lib/cmsBlogs.ts)
     │  • reads every .md file with fs.readdirSync
     │  • parses frontmatter (title, date, excerpt, …)
     │  • converts markdown body to plain text
     │  • sorts newest-first
     ▼
JournalCard components on the home page (/)
```

**Key rule:** CMS markdown files take priority over the hardcoded fallback entries in `src/data/trail.ts`. As soon as one `.md` file exists in `content/blogs/`, the three hardcoded demo entries are no longer shown.

---

## Part 8 – The Two Blog Systems Side by Side

The project has two independent ways to publish posts. They serve different purposes:

| | **Decap CMS** | **Writer Studio (`/studio`)** |
|---|---|---|
| **How to access** | `yoursite.com/admin` | `yoursite.com/studio` |
| **Authentication** | Netlify Identity (email + password) | Simple client-side password |
| **Where posts are stored** | `content/blogs/*.md` on GitHub | Browser `localStorage` only |
| **Visible on other devices?** | Yes — site rebuilds, all visitors see it | No — only in that browser |
| **Survives clearing browser data?** | Yes | No |
| **Requires Netlify setup?** | Yes | No |
| **Best for** | Real public posts | Quick drafts, testing, demos |

**Recommended workflow:**
- Use **Writer Studio** to draft and preview ideas privately.
- Use **Decap CMS** to publish posts that should appear publicly on the live site.

---

## Part 9 – Environment Variables

### Studio password (optional)
The Writer Studio password defaults to `trailnotes2026`. To change it without editing code:

1. In Netlify: **Site configuration** → **Environment variables** → **Add a variable**.
   - **Key:** `NEXT_PUBLIC_TRAIL_NOTES_STUDIO_PASSWORD`
   - **Value:** your chosen password

2. For local development, create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_TRAIL_NOTES_STUDIO_PASSWORD=your_password_here
   ```
   This file is listed in `.gitignore` and will not be committed to GitHub.

---

## Part 10 – Troubleshooting

### "Page Not Found" at `/admin`
The CMS is served from `public/admin/index.html`. Make sure the file exists and the Netlify deploy completed without errors.

### Netlify Identity popup does not appear
Ensure the Netlify Identity widget script is in `public/admin/index.html`:
```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```
Check it is loading without a 404 in the browser DevTools Network tab.

### "Failed to persist entry" when saving in CMS
This usually means Git Gateway is not authorised. Go to Netlify → **Identity** → **Services** → **Git Gateway** and re-authorise.

### Post saved in CMS but not appearing on the site
The site needs to rebuild after the commit. Check the **Deploys** tab in Netlify to see if a new build was triggered. If not, click **Trigger deploy** → **Deploy site**.

### Build failing after adding a new `.md` file
Check the frontmatter syntax. Common mistakes:
- Missing quotes around dates: use `date: "2026-03-08"` not `date: 2026-03-08`
- Tabs instead of spaces in YAML indentation

### `npx decap-server` not found locally
Install it globally once:
```bash
npm install -g decap-server
```
Then run `decap-server` directly.

---

## Quick Reference Checklist

### One-time setup
- [ ] Push project to a **public** GitHub repository
- [ ] Create a Netlify site connected to that repo
- [ ] Set build command: `npm run build`, publish dir: `.next`
- [ ] Enable **Netlify Identity** and set registration to **Invite only**
- [ ] Enable **Git Gateway** under Identity → Services
- [ ] Invite yourself via **Identity** → **Invite users** and set your CMS password
- [ ] Update `site_url` / `display_url` in `public/admin/config.yml`
- [ ] Update `metadataBase` in `src/app/layout.tsx`

### Every time you write a new post
1. Go to `yoursite.com/admin`
2. Log in with your Netlify Identity email + password
3. Click **New Blog Post** and fill in the fields
4. Save → change status to **Ready** → **Publish**
5. Wait ~60 seconds for Netlify to rebuild
6. Post appears on `yoursite.com`
