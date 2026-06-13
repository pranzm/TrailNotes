"use client";

import { useEffect, useState } from "react";

// sessionStorage key: unlike localStorage this is cleared when the tab closes,
// so the studio re-locks automatically at the start of a new browser session.
const ACCESS_STORAGE_KEY = "trail-notes-studio-unlocked";

// Password is read from an env var so it can be rotated without code changes.
// Defaults to a readable placeholder suitable for development only.
// NEXT_PUBLIC_ prefix makes it available on the client bundle; do not store
// secrets that must remain server-side in NEXT_PUBLIC_ variables.
const STUDIO_PASSWORD =
  process.env.NEXT_PUBLIC_TRAIL_NOTES_STUDIO_PASSWORD || "trailnotes2026";

// PasswordGate wraps its children behind a session-scoped password check.
// When locked it renders a login form. When unlocked it renders children
// plus a "Lock Studio" button.
export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState(
    "Enter the private studio password to continue."
  );

  useEffect(() => {
    // Deferred by one tick to prevent SSR/client hydration mismatch:
    // server always renders the locked state; client reconciles on mount.
    const initialRead = window.setTimeout(() => {
      setIsUnlocked(window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === "true");
    }, 0);

    return () => window.clearTimeout(initialRead);
  }, []);

  // Validates the submitted password and writes the unlocked flag to sessionStorage.
  // Using sessionStorage (not localStorage) means the studio locks again
  // when the user closes the tab or window.
  function unlockStudio(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() !== STUDIO_PASSWORD) {
      setMessage("Incorrect password. Please try again.");
      return;
    }

    window.sessionStorage.setItem(ACCESS_STORAGE_KEY, "true");
    setIsUnlocked(true);
  }

  // Clears the session flag and resets local state back to the locked UI.
  function lockStudio() {
    window.sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    setIsUnlocked(false);
    setPassword("");
    setMessage("Studio locked.");
  }

  if (isUnlocked) {
    return (
      <div>
        {/* Lock button sits above the editor as an escape hatch */}
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={lockStudio}
            className="rounded-full border border-deep-forest/15 bg-white/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/62 transition hover:border-energy-orange hover:text-energy-orange"
          >
            Lock Studio
          </button>
        </div>
        {children}
      </div>
    );
  }

  // Locked state: render the password form only.
  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-deep-forest/10 bg-white/86 p-6 shadow-2xl shadow-deep-forest/10 sm:p-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-energy-orange">
        Private Access
      </p>
      <h2 className="font-heading text-3xl font-bold tracking-tight text-deep-forest">
        Writer Studio is private.
      </h2>
      <p className="mt-4 text-sm leading-7 text-charcoal/62">
        This page is intentionally hidden from public navigation and requires a
        password before the blog editor is shown.
      </p>
      <form onSubmit={unlockStudio} className="mt-6">
        <label className="block text-sm font-bold text-deep-forest">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-deep-forest/10 bg-warm-sand px-4 py-3 text-charcoal outline-none transition focus:border-trail-green focus:ring-4 focus:ring-soft-sage/25"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-deep-forest px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-trail-green"
        >
          Unlock Studio
        </button>
      </form>
      <p className="mt-4 rounded-2xl bg-warm-sand px-4 py-3 text-sm text-charcoal/60">
        {message}
      </p>
    </section>
  );
}
