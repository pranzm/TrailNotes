// Mirrors src/components/PublishedPosts.tsx: reads posts published by the
// Writer Studio (/studio) from localStorage and renders them below the
// hardcoded blog cards. Returns gracefully if nothing has been published.
const BLOG_STORAGE_KEY = "trail-notes-published-posts";

function readPosts() {
  try {
    const stored = window.localStorage.getItem(BLOG_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function renderPublishedPosts() {
  const container = document.getElementById("published-posts");
  if (!container) return;

  const posts = readPosts();

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="published-empty">
        Client-published blogs will appear here in this browser. Connect a CMS
        later when these posts need to publish publicly across devices.
      </div>`;
    return;
  }

  const cards = posts
    .map((post) => {
      const chips = [post.route, post.distance, post.elevation]
        .filter(Boolean)
        .map((chip) => `<span>${escapeHtml(chip)}</span>`)
        .join("");

      return `
        <article class="published-card">
          <p class="pub-date">${escapeHtml(post.publishedAt)}</p>
          <h4>${escapeHtml(post.title)}</h4>
          <div class="chips">${chips}</div>
          <p class="excerpt">${escapeHtml(post.excerpt)}</p>
          <details>
            <summary>Read full blog</summary>
            <div>${escapeHtml(post.body)}</div>
          </details>
        </article>`;
    })
    .join("");

  container.innerHTML = `
    <div class="published-section">
      <p class="eyebrow">Published by Rideep</p>
      <h3>Fresh blogs by Rideep</h3>
      <div class="card-grid">${cards}</div>
    </div>`;
}

renderPublishedPosts();
window.addEventListener("storage", renderPublishedPosts);
