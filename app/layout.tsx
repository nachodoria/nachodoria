import type { Metadata } from "next";
import {
  Caprasimo,
  Chicle,
  Corben,
  Dorsa,
  Geist_Mono,
  Instrument_Sans,
  Ranchers,
  Righteous,
  Smokum,
  Yellowtail,
  Young_Serif,
} from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const corben = Corben({
  variable: "--font-corben",
  subsets: ["latin"],
  weight: "700",
  preload: false,
});

const chicle = Chicle({
  variable: "--font-chicle",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const dorsa = Dorsa({
  variable: "--font-dorsa",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const ranchers = Ranchers({
  variable: "--font-ranchers",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const smokum = Smokum({
  variable: "--font-smokum",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});


export const metadata: Metadata = {
  metadataBase: new URL("https://ignaciodoria.vercel.app"),
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
        className={`${instrumentSans.variable} ${geistMono.variable} ${corben.variable} ${chicle.variable} ${caprasimo.variable} ${yellowtail.variable} ${youngSerif.variable} ${righteous.variable} ${dorsa.variable} ${ranchers.variable} ${smokum.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
