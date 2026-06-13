import type { Stat } from "@/data/trail";

// StatsCard is a Server Component — pure display, no interactivity.
// Renders a single metric: label (small caps) → value (large bold) → detail (caption).
export function StatsCard({ stat }: { stat: Stat }) {
  return (
    <article className="rounded-3xl border border-deep-forest/10 bg-white/78 p-6 shadow-sm transition hover:-translate-y-1 hover:border-trail-green/30 hover:shadow-xl hover:shadow-deep-forest/8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-trail-green">
        {stat.label}
      </p>
      <p className="mt-4 font-heading text-3xl font-bold text-deep-forest">
        {stat.value}
      </p>
      <p className="mt-3 text-sm leading-6 text-charcoal/62">{stat.detail}</p>
    </article>
  );
}
