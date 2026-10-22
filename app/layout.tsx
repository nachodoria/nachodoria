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


export const metadata: Metadata = {
  metadataBase: new URL("https://idoria.dev"),
  title: {
    default: "Ignacio Doria",
    template: "%s | Ignacio Doria",
  },
  description:
    "Portfolio of Ignacio Doria — a software developer from Toronto focused on building reliable, high-performance web experiences.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ignacio Doria",
    title: "Ignacio Doria",
    description:
      "Portfolio of Ignacio Doria — a software developer from Toronto focused on building reliable, high-performance web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignacio Doria",
    description:
      "Portfolio of Ignacio Doria — a software developer from Toronto focused on building reliable, high-performance web experiences.",
  },
  robots: {
    index: true,
    follow: true,
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
        <SmoothScroll>
          <Providers>{children}</Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}
