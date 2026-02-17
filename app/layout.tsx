import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';


const cormorant_Garamond = Cormorant_Garamond({ subsets: ["latin"], weight: "400", variable: '--font-garamond' });
const monosans = localFont({ src: "../public/fonts/Mona-Sans.ttf", variable: '--font-monosans' });

export const metadata: Metadata = {
  title: "Ignacio's 2024 Portfolio ",
  description: "Ignacio's 2024 Portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={`${cormorant_Garamond.variable} ${monosans.variable} scroll-smooth`} >
      <head>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🚀</text></svg>"></link>      
      </head>
      <body className="bg-background">{children}</body>
    </html>
  );
}
