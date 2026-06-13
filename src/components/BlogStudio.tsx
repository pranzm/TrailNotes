"use client";

import { useEffect, useRef, useState } from "react";
import {
  BLOG_DRAFT_STORAGE_KEY,
  BLOG_STORAGE_KEY,
  type BlogPost
} from "@/data/blog";

// BlogForm is BlogPost without the fields generated at publish time:
// id is assigned by createPostId() and publishedAt is set to the current date.
type BlogForm = Omit<BlogPost, "id" | "publishedAt">;

const emptyForm: BlogForm = {
  title: "",
  category: "Training Note",
  route: "",
  distance: "",
  elevation: "",
  excerpt: "",
  body: ""
};

// Shared Tailwind class string for all form input/select/textarea elements.
const fieldStyles =
  "mt-2 w-full rounded-2xl border border-deep-forest/10 bg-white px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-trail-green focus:ring-4 focus:ring-soft-sage/25";

// Reads the published posts array from localStorage.
// Returns [] on parse error so the studio renders cleanly even if the
// stored value is corrupted.
function readStoredPosts(): BlogPost[] {
  try {
    const storedPosts = window.localStorage.getItem(BLOG_STORAGE_KEY);
    return storedPosts ? (JSON.parse(storedPosts) as BlogPost[]) : [];
  } catch {
    return [];
  }
}

// Formats a Date to a human-readable string ("08 Mar 2026") for storage in
// BlogPost.publishedAt. Stored as display string, not ISO, so it renders directly.
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

// Generates a unique post ID. Prefers the Web Crypto API (available in all
// modern browsers and Node 16+). Falls back to a Date.now() string for
// environments where crypto.randomUUID is unavailable.
function createPostId() {
  if ("crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }

  return `post-${Date.now()}`;
}

// BlogStudio is the full-page editor for creating, previewing, and managing
// blog posts. It is a Client Component because it reads/writes localStorage
// and manages controlled form state.
//
// State:
//   form    — current values in the editor (controlled inputs)
//   posts   — array of published posts read from localStorage
//   message — status string shown in the feedback bar below the action buttons
export function BlogStudio() {
  // formRef lets readCurrentForm() pull fresh FormData values without relying
  // on the React state cycle — useful when the form is submitted programmatically.
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("Drafts are saved only on this device.");

  useEffect(() => {
    // Deferred by one tick: prevents SSR hydration mismatch because localStorage
    // is not available during server rendering.
    const initialRead = window.setTimeout(() => {
      setPosts(readStoredPosts());

      // Restore a previously saved draft so the user can continue writing
      // after closing and reopening the browser.
      const storedDraft = window.localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);
      if (storedDraft) {
        try {
          setForm(JSON.parse(storedDraft) as BlogForm);
        } catch {
          // Discard malformed draft silently — better to start fresh than crash.
          window.localStorage.removeItem(BLOG_DRAFT_STORAGE_KEY);
        }
      }
    }, 0);

    return () => window.clearTimeout(initialRead);
  }, []);

  // Generic field updater for all controlled inputs. Merges the changed field
  // into the current form state without touching other fields.
  function updateField(field: keyof BlogForm, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  // Reads the latest FormData from the DOM rather than from React state.
  // This is necessary because React batches state updates — calling this
  // immediately after an event gives the freshest possible values.
  function readCurrentForm(): BlogForm {
    if (!formRef.current) {
      return form;
    }

    const formData = new FormData(formRef.current);

    return {
      title: String(formData.get("title") || ""),
      category: String(formData.get("category") || "Training Note"),
      route: String(formData.get("route") || ""),
      distance: String(formData.get("distance") || ""),
      elevation: String(formData.get("elevation") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      body: String(formData.get("body") || "")
    };
  }

  // Persists the current form to localStorage under the draft key.
  // Does not create a post — the user can close the browser and return later.
  function saveDraft() {
    const currentForm = readCurrentForm();
    window.localStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(currentForm));
    setForm(currentForm);
    setMessage("Draft saved. You can close the browser and continue later on this device.");
  }

  // Validates, builds a BlogPost, prepends it to the published array, persists
  // to localStorage, clears the draft, and resets the form.
  function publishPost() {
    const currentForm = readCurrentForm();

    // Minimal validation: title and body are the only required fields.
    if (!currentForm.title.trim() || !currentForm.body.trim()) {
      setMessage("Add a title and the main story before publishing.");
      return;
    }

    const nextPost: BlogPost = {
      ...currentForm,
      id: createPostId(),
      title: currentForm.title.trim(),
      // Auto-generate excerpt from first 28 words of body if none was provided.
      excerpt:
        currentForm.excerpt.trim() ||
        currentForm.body
          .trim()
          .split(/\s+/)
          .slice(0, 28)
          .join(" ")
          .concat("..."),
      publishedAt: formatDate(new Date())
    };

    // Prepend so newest post always appears first.
    const nextPosts = [nextPost, ...posts];
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(nextPosts));
    // Clear the in-progress draft now that it has been published.
    window.localStorage.removeItem(BLOG_DRAFT_STORAGE_KEY);
    setPosts(nextPosts);
    setForm(emptyForm);
    setMessage("Published to the website preview on this browser.");
  }

  // Removes a single post by id and persists the remaining array.
  function deletePost(postId: string) {
    const nextPosts = posts.filter((post) => post.id !== postId);
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(nextPosts));
    setPosts(nextPosts);
    setMessage("Post removed from this browser.");
  }

  // Creates a JSON file download of the current posts array as a backup.
  // Uses URL.createObjectURL / revokeObjectURL to avoid memory leaks.
  function exportBackup() {
    const backup = JSON.stringify(posts, null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trail-notes-posts-backup.json";
    link.click();
    // Revoke immediately — the browser has already queued the download.
    URL.revokeObjectURL(url);
    setMessage("Backup downloaded.");
  }

  return (
    // Two-column layout: editor form left, live preview + posts list right.
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      {/* ── Editor form ─────────────────────────────────────────────── */}
      <form
        ref={formRef}
        className="rounded-[2rem] border border-deep-forest/10 bg-white/86 p-5 shadow-xl shadow-deep-forest/8 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          publishPost();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Title: spans both grid columns */}
          <label className="block text-sm font-bold text-deep-forest sm:col-span-2">
            Blog title
            <input
              className={fieldStyles}
              name="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Example: What the marathon taught me"
            />
          </label>

          <label className="block text-sm font-bold text-deep-forest">
            Category
            <select
              className={fieldStyles}
              name="category"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            >
              <option>Training Note</option>
              <option>Race Report</option>
              <option>Route Reflection</option>
              <option>Gear Note</option>
              <option>Travel Story</option>
            </select>
          </label>

          <label className="block text-sm font-bold text-deep-forest">
            Route or event
            <input
              className={fieldStyles}
              name="route"
              value={form.route}
              onChange={(event) => updateField("route", event.target.value)}
              placeholder="Tata Mumbai Marathon"
            />
          </label>

          <label className="block text-sm font-bold text-deep-forest">
            Distance
            <input
              className={fieldStyles}
              name="distance"
              value={form.distance}
              onChange={(event) => updateField("distance", event.target.value)}
              placeholder="42.2 km"
            />
          </label>

          <label className="block text-sm font-bold text-deep-forest">
            Elevation
            <input
              className={fieldStyles}
              name="elevation"
              value={form.elevation}
              onChange={(event) => updateField("elevation", event.target.value)}
              placeholder="Optional"
            />
          </label>

          {/* Short summary: spans both columns */}
          <label className="block text-sm font-bold text-deep-forest sm:col-span-2">
            Short summary
            <textarea
              className={`${fieldStyles} min-h-24 resize-y`}
              name="excerpt"
              value={form.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              placeholder="One or two lines that introduce the post."
            />
          </label>

          {/* Main story: spans both columns; min-h-64 gives adequate writing space */}
          <label className="block text-sm font-bold text-deep-forest sm:col-span-2">
            Main story
            <textarea
              className={`${fieldStyles} min-h-64 resize-y leading-7`}
              name="body"
              value={form.body}
              onChange={(event) => updateField("body", event.target.value)}
              placeholder="Write naturally. Add training lessons, race memories, route notes, or practical advice."
            />
          </label>
        </div>

        {/* Action buttons: Publish (submit), Save Draft, Export Backup */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-full bg-deep-forest px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-trail-green"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-full border border-deep-forest/15 bg-warm-sand px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-deep-forest transition hover:border-trail-green hover:text-trail-green"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={exportBackup}
            className="rounded-full border border-deep-forest/15 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-charcoal/70 transition hover:border-energy-orange hover:text-energy-orange"
          >
            Export Backup
          </button>
        </div>

        {/* Status / feedback bar — updates after every action */}
        <p className="mt-5 rounded-2xl bg-warm-sand px-4 py-3 text-sm leading-6 text-charcoal/62">
          {message}
        </p>
      </form>

      {/* ── Right panel ─────────────────────────────────────────────── */}
      <aside className="space-y-6">
        {/* Live preview: mirrors the form fields in real time as the user types */}
        <section className="rounded-[2rem] bg-deep-forest p-6 text-white shadow-2xl shadow-deep-forest/16">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-energy-orange">
            Live Preview
          </p>
          <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight">
            {form.title || "Your blog title appears here"}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
            <span>{form.category}</span>
            {form.route && <span>{form.route}</span>}
            {form.distance && <span>{form.distance}</span>}
          </div>
          <p className="mt-6 leading-7 text-white/70">
            {form.excerpt ||
              "Write a short summary so readers know what this note is about."}
          </p>
          {/* max-h-72 + overflow-y-auto prevents the preview from growing too tall */}
          <div className="mt-6 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-white/8 p-4 text-sm leading-7 text-white/72">
            {form.body || "The main story preview appears here as you write."}
          </div>
        </section>

        {/* Published posts list with per-post delete buttons */}
        <section className="rounded-[2rem] border border-deep-forest/10 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold text-deep-forest">
              Published posts
            </h2>
            {/* Post count badge */}
            <span className="rounded-full bg-soft-sage/25 px-3 py-1 text-sm font-bold text-trail-green">
              {posts.length}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {posts.length === 0 ? (
              <p className="text-sm leading-6 text-charcoal/58">
                No posts yet. Publish your first note from the editor.
              </p>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-deep-forest/8 bg-warm-sand p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-energy-orange">
                    {post.publishedAt}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-deep-forest">
                    {post.title}
                  </h3>
                  {/* Delete immediately updates localStorage and re-renders the list */}
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/50 transition hover:text-energy-orange"
                  >
                    Delete
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
