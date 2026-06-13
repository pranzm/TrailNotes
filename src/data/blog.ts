// localStorage keys are module-level constants so both BlogStudio (writer) and
// PublishedPosts (reader) import the same strings — no risk of key drift.
export const BLOG_STORAGE_KEY = "trail-notes-published-posts";
export const BLOG_DRAFT_STORAGE_KEY = "trail-notes-current-draft";

// BlogPost is the shape stored in and read from localStorage.
// `id` is a UUID (or Date.now() fallback). `publishedAt` is a pre-formatted
// display string ("08 Mar 2026") — not a raw ISO date — so it renders directly.
export type BlogPost = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  route: string;
  distance: string;
  elevation: string;
  excerpt: string;
  body: string;
};
