"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import AnimatedTitle from "./components/main/AnimatedTitle";
import SubHeader from "./components/main/SubHeader";
import Navbar from "./components/global/Navbar";
import CustomCursor from "./components/global/CustomCursor";
import SmoothScroll from "./components/global/SmoothScroll";
import AboutSection from "./components/main/AboutSection";
import ContactSection from "./components/contact/ContactSection";
import WorkSection from "./components/work/WorkSection";

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
    document.body.style.pointerEvents = "";

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
    <SmoothScroll enabled={isReady}>
      <main className="flex flex-col w-full bg-[var(--background)]">
        <CustomCursor />
        <Navbar isReady={isReady} />

        {/* Hero Section - Not Sticky */}
        <section className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col w-full items-center">
            <AnimatedTitle
              text="IGNACIO DORIA"
              skipAnimation={skipIntro}
              onComplete={() => setIsReady(true)}
            />
            <SubHeader isReady={isReady} />
          </div>
        </section>

        <AboutSection />
        <WorkSection />
        <ContactSection />
      </main>
    </SmoothScroll>
  );
}
