import type { JournalEntry } from "@/data/trail";

// JournalCard is a Server Component. It uses a native <details>/<summary> to
// toggle the full blog body, requiring zero JavaScript and keeping it RSC-safe.
export function JournalCard({ entry }: { entry: JournalEntry }) {
  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-deep-forest/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-deep-forest/10">
      {/* Date (green) + "Blog" pill — top row metadata */}
      <div className="flex items-center justify-between gap-4 text-sm">
        <time className="font-semibold text-trail-green">{entry.date}</time>
        <span className="rounded-full bg-warm-sand px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-deep-forest">
          Blog
        </span>
      </div>

      {/* Route name as the card headline */}
      <h3 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-deep-forest">
        {entry.routeName}
      </h3>

      {/* Distance and elevation stats side-by-side in warm-sand pills */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-warm-sand p-4">
          <p className="text-charcoal/48">Distance</p>
          <p className="mt-1 font-bold text-deep-forest">{entry.distance}</p>
        </div>
        <div className="rounded-2xl bg-warm-sand p-4">
          <p className="text-charcoal/48">Elevation</p>
          <p className="mt-1 font-bold text-deep-forest">{entry.elevation}</p>
        </div>
      </div>

      {/* Always-visible reflection teaser — flex-1 pushes the details toggle to the bottom */}
      <div className="mt-6 flex-1 leading-7 text-charcoal/68">
        <p>{entry.reflection}</p>
      </div>

      {/* Full body text hidden until the user clicks "Read full blog".
          Native <details> handles open/close with no JS. */}
      <details className="mt-6 group/details">
        <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.14em] text-trail-green transition hover:text-energy-orange [&::-webkit-details-marker]:hidden">
          Read full blog
        </summary>
        <p className="mt-4 border-t border-deep-forest/10 pt-4 leading-7 text-charcoal/68">
          {entry.body}
        </p>
      </details>

      {/* Decorative orange underline bar: expands on card hover */}
      <span className="mt-6 h-1 w-12 rounded-full bg-energy-orange transition group-hover:w-20" />
    </article>
  );
}
