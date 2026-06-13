type SectionHeadingProps = {
  eyebrow: string;     // small orange label above the title, e.g. "About"
  title: string;       // large h2 heading
  description: string; // grey body paragraph below the title
  align?: "left" | "center";
};

// SectionHeading is a Server Component used in every major section of the home
// page. It produces a consistent three-level hierarchy: eyebrow → h2 → p.
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  // mx-auto + text-center only when align="center"; left alignment is the default.
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-energy-orange">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl font-bold tracking-tight text-deep-forest sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-charcoal/70 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
