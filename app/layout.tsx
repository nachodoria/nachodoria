import type { Metadata } from "next";
import {
  Caprasimo,
  Chicle,
  Corben,
  Dorsa,
  Instrument_Sans,
  Ranchers,
  Righteous,
  Smokum,
  Yellowtail,
  Young_Serif,
} from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const corben = Corben({
  variable: "--font-corben",
  subsets: ["latin"],
  weight: "700",
});

const chicle = Chicle({
  variable: "--font-chicle",
  subsets: ["latin"],
  weight: "400",
});

const caprasimo = Caprasimo({
  variable: "--font-caprasimo",
  subsets: ["latin"],
  weight: "400",
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  weight: "400",
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
});

const dorsa = Dorsa({
  variable: "--font-dorsa",
  subsets: ["latin"],
  weight: "400",
});

const ranchers = Ranchers({
  variable: "--font-ranchers",
  subsets: ["latin"],
  weight: "400",
});

const smokum = Smokum({
  variable: "--font-smokum",
  subsets: ["latin"],
  weight: "400",
});


export const metadata: Metadata = {
  title: "Ignacio Doria - Portfolio",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${corben.variable} ${chicle.variable} ${caprasimo.variable} ${yellowtail.variable} ${youngSerif.variable} ${righteous.variable} ${dorsa.variable} ${ranchers.variable} ${smokum.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
