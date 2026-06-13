import type { Route } from "@/data/trail";

// Each difficulty level maps to a distinct colour scheme for the badge pill.
// Using a Record keyed on the union ensures TypeScript catches any missing cases.
const difficultyStyles: Record<Route["difficulty"], string> = {
  Easy: "bg-soft-sage/30 text-trail-green",
  Moderate: "bg-energy-orange/12 text-energy-orange",
  Hard: "bg-deep-forest text-white"
};

// RouteCard is a Server Component — pure display, no interactivity.
// The .contour-lines CSS class (defined in globals.css) adds radial-gradient
// rings that evoke topographic elevation lines on the dark background.
export function RouteCard({ route }: { route: Route }) {
  return (
    <article className="contour-lines relative overflow-hidden rounded-[2rem] border border-soft-sage/30 bg-deep-forest p-6 text-white shadow-xl shadow-deep-forest/10">
      {/* Decorative abstract circle — top-right corner accent */}
      <div className="absolute -right-8 top-8 h-28 w-28 rounded-full border border-soft-sage/20" />
      {/* Decorative elliptical arc — bottom accent mimicking a contour line */}
      <div className="absolute bottom-0 left-8 h-24 w-48 -rotate-12 rounded-[100%] border-t-2 border-energy-orange/70" />

      {/* Content sits above the absolute decorations via `relative` */}
      <div className="relative">
        {/* Location (small caps) + difficulty badge — top metadata row */}
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-soft-sage">
            {route.location}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyStyles[route.difficulty]}`}
          >
            {route.difficulty}
          </span>
        </div>

        {/* Route name as the card headline */}
        <h3 className="mt-8 font-heading text-2xl font-semibold tracking-tight">
          {route.name}
        </h3>

        {/* Distance and terrain in a 2-column definition list */}
        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-white/50">Distance</dt>
            <dd className="mt-1 text-xl font-bold">{route.distance}</dd>
          </div>
          <div>
            <dt className="text-white/50">Terrain</dt>
            <dd className="mt-1 leading-6 text-white/82">{route.terrain}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
