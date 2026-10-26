import type { Metadata } from "next";
import { Anton, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SmoothScroll from "./components/global/SmoothScroll";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
});

// Must match the primary domain in Vercel (the one other domains redirect TO).
const SITE_URL = "https://www.idoria.dev";
const FULL_NAME = "Ignacio Doria Oberman";
const SITE_DESCRIPTION =
  "Portfolio of Ignacio Doria Oberman, known as Ignacio Doria — a software developer from Toronto focused on building reliable, high-performance web experiences.";

// Note: no `alternates.canonical` here. A canonical in the root layout is
// inherited by every route, which would mark /about and /work/* as duplicates
// of the homepage. Set it per page instead (e.g. canonical: "/about").
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ignacio Doria",
    template: "%s | Ignacio Doria",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Ignacio Doria",
    title: "Ignacio Doria",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignacio Doria",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Structured data (schema.org) read by search engines.
// - WebSite: tells Google which site name to show above the URL in results.
// - Person: associates this site with every name/handle variant you go by.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Ignacio Doria",
      alternateName: ["idoria.dev", "Idoria"],
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Ignacio Doria",
      alternateName: [FULL_NAME, "Doria Oberman", "Idoria", "Doria"],
      url: `${SITE_URL}/`,
      sameAs: [
        "https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/",
        "https://github.com/nachodoria",
      ],
      jobTitle: "Software Developer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Toronto",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${instrumentSans.variable} ${anton.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <SmoothScroll>
          <Providers>{children}</Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
