import Image from "next/image";
import Link from "next/link";

// Footer is a Server Component — static markup, no interactivity needed.
export function Footer() {
  return (
    <footer className="bg-deep-forest px-5 py-10 text-white sm:px-8">
      {/* Single row on md+: logo/tagline left, copyright right */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-white/10 pt-10 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-4">
          {/* Logo mark on charcoal background to contrast against the deep-forest footer */}
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-charcoal">
            <Image
              src="/TrailNotes/assets/trail-notes-logo.png"
              alt="Trail Notes logo"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </span>
          <span>
            <span className="block font-heading text-lg font-bold uppercase tracking-[0.28em]">
              Trail Notes
            </span>
            <span className="text-sm text-white/54">
              Routes, reflections, and disciplined miles.
            </span>
          </span>
        </Link>
        <div className="flex flex-col gap-3 text-sm text-white/54 sm:flex-row sm:items-center sm:gap-6">
          <p>© 2026 Trail Notes. Built for the miles that stay with you.</p>
        </div>
      </div>
    </footer>
  );
}
