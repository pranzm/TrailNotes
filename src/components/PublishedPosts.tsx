"use client";

import { useEffect, useState } from "react";
import { BLOG_STORAGE_KEY, type BlogPost } from "@/data/blog";

// Reads the published posts array from localStorage.
// Returns [] on any parse error so the component renders gracefully even if
// the stored value is corrupted or from an incompatible schema version.
function readPosts(): BlogPost[] {
  try {
    const storedPosts = window.localStorage.getItem(BLOG_STORAGE_KEY);
    return storedPosts ? (JSON.parse(storedPosts) as BlogPost[]) : [];
  } catch {
    return [];
  }
}

// PublishedPosts reads localStorage posts created by BlogStudio (/studio).
// It is a Client Component because:
//   1. localStorage is browser-only (not available in SSR).
//   2. It must react to the "storage" event to update when another tab publishes.
export function PublishedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Defer the initial localStorage read by one tick. This prevents hydration
    // mismatch: the server renders an empty array, and the client immediately
    // reconciles with the real stored data after mount.
    const initialRead = window.setTimeout(() => setPosts(readPosts()), 0);

    // The "storage" event fires in all other tabs of the same origin when
    // localStorage is modified. This keeps PublishedPosts in sync when the
    // user has both the home page and /studio open simultaneously.
    function handleStorageChange() {
      setPosts(readPosts());
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Show a placeholder card when no studio posts exist yet.
  if (posts.length === 0) {
    return (
      <div className="mt-8 rounded-[2rem] border border-dashed border-trail-green/28 bg-warm-sand/70 p-6 text-sm leading-6 text-charcoal/62">
        Client-published blogs will appear here in this browser. Connect a CMS
        later when these posts need to publish publicly across devices.
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Section sub-header: eyebrow label + heading */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-energy-orange">
            Published by Rideep
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-deep-forest">
            Fresh blogs by Rideep
          </h3>
        </div>
      </div>

      {/* Grid of post cards — same 3-column layout as JournalCard section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-[2rem] border border-deep-forest/10 bg-warm-sand p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-forest/8"
          >
            <p className="text-sm font-semibold text-trail-green">
              {post.publishedAt}
            </p>
            <h4 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-deep-forest">
              {post.title}
            </h4>
            {/* Optional metadata chips: only rendered when the field was filled in */}
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/56">
              {post.route && <span>{post.route}</span>}
              {post.distance && <span>{post.distance}</span>}
              {post.elevation && <span>{post.elevation}</span>}
            </div>
            <p className="mt-5 leading-7 text-charcoal/68">{post.excerpt}</p>
            {/* Full body behind a native <details> toggle — no JS state needed */}
            <details className="mt-6">
              <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.14em] text-trail-green transition hover:text-energy-orange [&::-webkit-details-marker]:hidden">
                Read full blog
              </summary>
              {/* whitespace-pre-wrap preserves line breaks written in the studio editor */}
              <div className="mt-4 whitespace-pre-wrap border-t border-deep-forest/10 pt-4 leading-7 text-charcoal/68">
                {post.body}
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
