import Image from "next/image";
import Link from "next/link";

// All links are in-page anchor hashes on the home page.
// The studio route is excluded intentionally — it's not publicly discoverable.
const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Routes", href: "/#routes" },
  { label: "Blogs", href: "/#notes" },
  { label: "Gear", href: "/#gear" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" }
];

// Header is a Server Component — no useState or browser APIs needed.
// `sticky top-0 z-50` keeps it visible while scrolling; backdrop-blur-xl
// softens the background without a fully opaque bar.
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-deep-forest/8 bg-warm-sand/86 backdrop-blur-xl">
      <nav aria-label="Primary navigation">
        {/* Desktop row: logo ←  nav links centre  → CTA button */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-deep-forest">
              <Image
                src="/TrailNotes/assets/trail-notes-logo.png"
                alt="Trail Notes logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
                // priority so the logo doesn't cause a layout shift on first load
                priority
              />
            </span>
            <span className="font-heading text-sm font-bold uppercase tracking-[0.28em] text-deep-forest">
              Trail Notes
            </span>
          </Link>

          {/* Hidden on mobile; visible from md breakpoint */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-charcoal/70 transition hover:text-trail-green"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/#contact"
            className="hidden rounded-full bg-deep-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-trail-green sm:inline-flex"
          >
            Contact
          </Link>
        </div>

        {/* Mobile chip row: replaces the hidden desktop nav below md.
            overflow-x-auto lets chips scroll horizontally if they overflow. */}
        <div className="border-t border-deep-forest/8 px-5 pb-3 md:hidden">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-deep-forest/10 bg-white/64 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-charcoal/68 transition hover:border-trail-green hover:text-trail-green"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
