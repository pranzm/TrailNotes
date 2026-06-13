import type { Metadata } from "next";
import "./globals.css";

// Open Graph images and canonical URLs are resolved relative to metadataBase.
// Set this to the real deployment URL before going live.
export const metadata: Metadata = {
  title: "Trail Notes | Running Journal and Trail Portfolio",
  description:
    "Trail Notes is a minimalist running portfolio for routes, reflections, training notes, gear, and the miles that shape the journey.",
  metadataBase: new URL("https://trailnotes.example"),
  openGraph: {
    title: "Trail Notes | Every trail has a story",
    description:
      "A calm, premium running journal for routes, reflections, training notes, and trail-running stories.",
    images: ["/assets/rideep-gogoi.jpg"]
  }
};

// RootLayout wraps every page in the app. It renders the bare <html> and
// <body> shells so that page-level components don't need to include them.
// globals.css is imported here once and applies to all routes.
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
