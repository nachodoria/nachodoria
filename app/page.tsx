"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useState } from "react";
import HeroName from "./components/main/HeroName";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";

const WorkSection = dynamic(() => import("./components/work/WorkSection"));
const ServicesSection = dynamic(() => import("./components/main/ServicesSection"));
// Pure canvas decoration, no server-renderable content — skip SSR entirely so it doesn't
// add to the server-rendered payload or block first paint. The wrapper div below already
// reserves its box size, so there's no layout shift once it mounts.
const DotGrid = dynamic(() => import("./components/main/DotGrid"), { ssr: false });

export default function Home() {
  const [returnScrollY] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;

    const savedScroll = sessionStorage.getItem("home-scroll-y");
    if (savedScroll === null) return null;

    const y = Number(savedScroll);
    return Number.isFinite(y) ? y : 0;
  });
  const [skipIntro] = useState(() => returnScrollY !== null);
  const [isReady, setIsReady] = useState(skipIntro);

  useEffect(() => {
    if (skipIntro) return;

    if (sessionStorage.getItem("home-scroll-y") !== null) return;

    const handleLoad = () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [skipIntro]);

  useLayoutEffect(() => {
    if (returnScrollY === null) return;

    sessionStorage.removeItem("home-scroll-y");
    window.scrollTo(0, returnScrollY);
  }, [returnScrollY]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!isReady) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [isReady]);

  return (
    <main className="flex w-full flex-col overflow-x-hidden bg-[var(--paper)]">
      <Header />

      {/* Hero Section - Not Sticky */}
      <section className="relative mb-32 flex min-h-[110svh] w-full flex-col gap-10 overflow-hidden md:mb-56 md:flex-row md:items-center md:gap-16">
        <div className="relative flex w-full items-center px-[8vw] py-16 md:w-1/2 md:px-[6vw] md:py-0">
          <HeroName skipAnimation={skipIntro} onComplete={() => setIsReady(true)} />
        </div>

        <div className="relative h-[56svh] w-full pr-[8vw] md:h-[74vh] md:w-1/2 md:pr-[6vw]">
          <DotGrid />
        </div>
      </section>

      <WorkSection />
      <ServicesSection />
      <Footer />
    </main>
  );
}
