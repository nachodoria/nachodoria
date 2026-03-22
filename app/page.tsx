"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useState } from "react";
import AnimatedTitle from "./components/main/AnimatedTitle";
import SubHeader from "./components/main/SubHeader";
import Navbar from "./components/global/Navbar";
import SmoothScroll from "./components/global/SmoothScroll";

const AboutSection = dynamic(() => import("./components/main/AboutSection"));
const WorkSection = dynamic(() => import("./components/work/WorkSection"));
const ContactSection = dynamic(() => import("./components/contact/ContactSection"));

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
    <SmoothScroll enabled={isReady}>
      <main className="flex w-full flex-col overflow-x-hidden bg-[var(--background)]">
        <Navbar isReady={isReady} />

        {/* Hero Section - Not Sticky */}
        <section className="flex min-h-[100svh] w-full items-center justify-center">
          <div className="flex flex-col w-full items-center">
            <AnimatedTitle
              text="IGNACIO DORIA"
              skipAnimation={skipIntro}
              onComplete={() => setIsReady(true)}
            />
            <SubHeader isReady={isReady} />
          </div>
        </section>

        <AboutSection isReady={isReady} />
        <WorkSection />
        <ContactSection />
      </main>
    </SmoothScroll>
  );
}
