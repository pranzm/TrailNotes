import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Trail Notes CMS",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-deep-forest text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-energy-orange">
          Trail Notes CMS
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
          Loading the private blog editor.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/62">
          If this is deployed, the CMS will ask the client to sign in through
          the configured identity provider before editing posts.
        </p>
      </div>
      <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
      <Script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js" />
    </main>
  );
}
