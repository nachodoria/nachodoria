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


const SITE_URL = "https://idoria.dev";
const FULL_NAME = "Ignacio Doria Oberman";
const SITE_DESCRIPTION =
  "Portfolio of Ignacio Doria Oberman, known as Ignacio Doria — a software developer from Toronto focused on building reliable, high-performance web experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: {
    default: "Ignacio Doria",
    template: "%s | Ignacio Doria",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
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

// Person structured data (schema.org), read by search engines to associate this
// site with every name/handle variant the person goes by — not just the display
// name used in visible copy. See the SEO note where this is wired into <body>.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ignacio Doria",
  alternateName: [FULL_NAME, "Doria Oberman", "Ignacio Doria Oberman", "Idoria", "Doria"],
  url: SITE_URL,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        <SmoothScroll>
          <Providers>{children}</Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
