import type { Metadata } from "next";
import { BlogStudio } from "@/components/BlogStudio";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PasswordGate } from "@/components/PasswordGate";

// The studio route is intentionally absent from the Header nav links so it
// isn't discoverable through the public site. The metadata title signals its
// private purpose while still being a valid Next.js page.
export const metadata: Metadata = {
  title: "Writer Studio | Trail Notes",
  description:
    "A simple non-technical writing utility for drafting, previewing, saving, and publishing Trail Notes blog posts in the browser."
};

// StudioPage is a Server Component shell. It renders the static layout wrapper
// and delegates auth + editing entirely to the two client components below.
export default function StudioPage() {
  return (
    <>
      <Header />
      <main className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Page header: eyebrow label + large h1 left, description card right */}
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-energy-orange">
                Writer Studio
              </p>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-deep-forest sm:text-6xl">
                Write, preview, and publish without touching code.
              </h1>
            </div>
            <div className="rounded-[2rem] border border-deep-forest/10 bg-white/72 p-6 text-sm leading-7 text-charcoal/64">
              This private utility is hidden from public navigation and requires
              a password before the editor is shown. Posts publish immediately
              in this browser and can be backed up as JSON.
            </div>
          </div>

          {/* PasswordGate blocks BlogStudio behind a sessionStorage password check.
              PasswordGate renders its children only when the studio is unlocked. */}
          <PasswordGate>
            <BlogStudio />
          </PasswordGate>
        </div>
      </main>
      <Footer />
    </>
  );
}
