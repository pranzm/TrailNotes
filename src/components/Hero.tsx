import Image from "next/image";

// Hero is a Server Component — no state or browser APIs needed.
export function Hero() {
  return (
    // id="home" makes the /#home anchor link from the Header scroll here.
    // .trail-map-bg applies the CSS grid-line pattern defined in globals.css.
    <section
      id="home"
      className="trail-map-bg relative overflow-hidden px-5 py-16 sm:px-8 lg:py-24"
    >
      {/* Blurred sage circle: decorative ambient glow in the top-right corner */}
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-soft-sage/30 blur-3xl" />

      {/* Two-column grid: headline/CTA left, logo card right */}
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        {/* Left column: tagline, headline, two CTA buttons */}
        <div className="relative z-10">
          {/* Small badge label above the main headline */}
          <p className="mb-6 inline-flex rounded-full border border-trail-green/18 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-trail-green">
            Running journal / route archive / trail notes
          </p>
          {/* Primary headline: tight line-height (0.95) for typographic impact */}
          <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-tight text-deep-forest sm:text-6xl lg:text-8xl">
            Every trail has a story.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-charcoal/72 sm:text-xl">
            A running journal for routes, reflections, training notes, and the
            miles that shape the journey.
          </p>
          {/* Two CTAs: primary (dark) scrolls to blog section, secondary scrolls to routes */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#notes"
              className="rounded-full bg-deep-forest px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-trail-green"
            >
              Explore Notes
            </a>
            <a
              href="#routes"
              className="rounded-full border border-deep-forest/20 bg-white/70 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-deep-forest transition hover:-translate-y-0.5 hover:border-trail-green hover:text-trail-green"
            >
              View Routes
            </a>
          </div>
        </div>

        {/* Right column: logo displayed in a dark bordered card */}
        <div className="relative z-10">
          <div className="relative mx-auto max-w-lg rounded-[2.5rem] border border-white/80 bg-deep-forest p-5 shadow-2xl shadow-deep-forest/20">
            {/* Vertical orange bar: decorative accent, hidden on smaller screens */}
            <div className="absolute -left-5 top-12 hidden h-40 w-2 rounded-full bg-energy-orange lg:block" />
            <Image
              src="/assets/trail-notes-logo.png"
              alt="Trail Notes contour-line trail map logo with runner silhouette"
              width={900}
              height={900}
              className="aspect-square w-full rounded-[2rem] object-cover"
              // priority ensures LCP image loads without waiting for render phase
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
