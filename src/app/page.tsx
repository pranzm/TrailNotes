import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JournalCard } from "@/components/JournalCard";
import { PublishedPosts } from "@/components/PublishedPosts";
import { RouteCard } from "@/components/RouteCard";
import { SectionHeading } from "@/components/SectionHeading";
import { StatsCard } from "@/components/StatsCard";
import { gearItems, journalEntries, routes, stats } from "@/data/trail";
import { getCmsBlogEntries } from "@/lib/cmsBlogs";

// Home is a React Server Component. getCmsBlogEntries() runs at request time
// (or build time in static export mode) using Node.js fs — safe here because
// this file never carries a "use client" directive.
export default function Home() {
  const cmsBlogEntries = getCmsBlogEntries();
  // CMS markdown files take precedence over the hardcoded fallback entries.
  // This keeps the page presentable before any .md files have been written.
  const blogEntries = cmsBlogEntries.length > 0 ? cmsBlogEntries : journalEntries;

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* ── About ─────────────────────────────────────────────────────── */}
        <section id="about" className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Two-column: text left, photo right on lg screens */}
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="About"
                  title="A personal record of discipline, distance, and discovery."
                  description="Rideep Gogoi is a runner and traveller from Assam, now based in Bangalore. What began as a simple fitness habit has become a practice of consistency, endurance, recovery, and learning through the miles."
                />
                <div className="mt-8 rounded-[2rem] border border-deep-forest/10 bg-white/70 p-6 leading-8 text-charcoal/70 shadow-sm sm:p-8">
                  <p>
                    Trail Notes gathers race experiences, training insights,
                    routes, travel stories, and lessons for beginner and
                    recreational runners who want to train smarter while still
                    enjoying the process.
                  </p>
                </div>
              </div>
              {/* Race photo with an overlay caption */}
              <figure className="relative overflow-hidden rounded-[2.5rem] bg-deep-forest p-3 shadow-2xl shadow-deep-forest/16">
                <Image
                  src="/TrailNotes/assets/rideep-gogoi.jpg"
                  alt="Rideep Gogoi running at the Tata Mumbai Marathon"
                  width={1200}
                  height={800}
                  className="aspect-[4/3] w-full rounded-[2rem] object-cover object-[54%_50%]"
                />
                <figcaption className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/14 bg-deep-forest/78 p-5 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-energy-orange">
                    Race Day
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold">
                    Tata Mumbai Marathon, 18 January 2026
                  </p>
                </figcaption>
              </figure>
            </div>
            {/* Four running stats rendered below the about text/photo */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Journey ──────────────────────────────────────────── */}
        {/* Decorative full-bleed dark card: photo fades into text on lg screens */}
        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-deep-forest text-white shadow-2xl shadow-deep-forest/18">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[22rem]">
                <Image
                  src="/TrailNotes/assets/rideep-gogoi.jpg"
                  alt="Rideep Gogoi focused during a marathon"
                  fill
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover object-[52%_48%]"
                />
                {/* Right-side gradient blends photo into the dark text panel */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-deep-forest/10 to-deep-forest/78 lg:bg-gradient-to-r" />
              </div>
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-energy-orange">
                  Featured Journey
                </p>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
                  From fitness habit to endurance practice.
                </h2>
                <p className="mt-6 leading-8 text-white/68">
                  The portfolio now anchors Rideep's story with a real race
                  moment, giving the brand a human center while preserving the
                  disciplined, minimalist Trail Notes identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trail Blogs ───────────────────────────────────────────────── */}
        <section id="notes" className="bg-white px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Trail Blogs"
              title="Stories from the road, ridge, and recovery days."
              description="Expandable blog entries that capture the useful details: where the run happened, how the body responded, and what the route taught."
            />
            {/* Server-rendered blog cards from CMS or fallback static data */}
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {blogEntries.map((entry) => (
                <JournalCard key={`${entry.date}-${entry.routeName}`} entry={entry} />
              ))}
            </div>
            {/* Client component that reads localStorage for studio-published posts */}
            <PublishedPosts />
          </div>
        </section>

        {/* ── Routes ───────────────────────────────────────────────────── */}
        <section id="routes" className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Routes"
              title="Map-like cards for climbs, loops, and steady miles."
              description="A static route archive for now, designed to become a practical library of trail profiles, terrain notes, and local knowledge."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {routes.map((route) => (
                <RouteCard key={route.name} route={route} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Gear / Training ──────────────────────────────────────────── */}
        <section id="gear" className="bg-deep-forest px-5 py-20 text-white sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Two-column: heading left, 2×2 gear grid right */}
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-energy-orange">
                  Gear / Training
                </p>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Minimal kit. Clear intent. Repeatable training.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/68">
                  Not an equipment catalog. Just the practical tools and habits
                  that support consistent running.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {gearItems.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-white/10 bg-white/7 p-6 transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    <h3 className="font-heading text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-4 leading-7 text-white/66">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Gallery ──────────────────────────────────────────────────── */}
        {/* 1 real photo (spans 2 cols) + 3 decorative placeholder cards */}
        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Gallery"
              title="Space reserved for trail light, race moments, and quiet roads."
              description="The gallery uses restrained placeholders now and is ready for real run photos later without changing the page structure."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-4">
              {/* Featured photo card: spans 2 of 4 columns */}
              <div className="group relative min-h-72 overflow-hidden rounded-[2rem] border border-deep-forest/10 bg-deep-forest p-6 md:col-span-2">
                <Image
                  src="/TrailNotes/assets/rideep-gogoi.jpg"
                  alt="Rideep Gogoi running during race day"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-[54%_50%] opacity-86 transition group-hover:scale-[1.02]"
                />
                {/* Bottom-up gradient darkens the image for label legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/76 via-deep-forest/12 to-transparent" />
                <p className="absolute bottom-6 left-6 right-6 z-10 text-sm font-bold uppercase tracking-[0.22em] text-white">
                  Race morning
                </p>
              </div>
              {/* Three placeholder cards with CSS-only decorative arcs */}
              {["Forest miles", "Summit start", "Recovery walk"].map(
                (label) => (
                  <div
                    key={label}
                    className="group relative min-h-72 overflow-hidden rounded-[2rem] border border-deep-forest/10 bg-trail-green/12 p-6"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.22),transparent_18rem),linear-gradient(135deg,rgba(46,90,67,0.28),rgba(15,31,23,0.06))]" />
                    {/* Arc that turns orange on hover — purely decorative */}
                    <div className="absolute bottom-8 left-6 right-6 h-20 rounded-[100%] border-t-2 border-deep-forest/24 transition group-hover:border-energy-orange/70" />
                    <p className="relative z-10 text-sm font-bold uppercase tracking-[0.22em] text-deep-forest/58">
                      {label}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section id="contact" className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-deep-forest p-8 text-white shadow-2xl shadow-deep-forest/18 sm:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-energy-orange">
                  Contact
                </p>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
                  Want to collaborate, run together, or share a trail?
                </h2>
              </div>
              <a
                href="mailto:hello@trailnotes.example"
                className="inline-flex justify-center rounded-full bg-energy-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-deep-forest"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
