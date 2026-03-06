"use client";

import { useState } from "react";
import AnimatedTitle from "./components/main/AnimatedTitle";
import SubHeader from "./components/main/SubHeader";
import Navbar from "./components/global/Navbar";
import CustomCursor from "./components/global/CustomCursor";
import SmoothScroll from "./components/global/SmoothScroll";
import WorkSection from "./components/work/WorkSection";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  window.onload = function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 100); // Delays execution by 100 milliseconds
  };

  return (
    <SmoothScroll>
      <main className="flex flex-col w-full bg-[var(--background)]">
        <CustomCursor />
        <Navbar isReady={isReady} />

        {/* Hero Section - Not Sticky */}
        <section className="min-h-screen w-full flex items-center justify-center">
          <div className="flex flex-col w-full items-center">
            <AnimatedTitle
              text="IGNACIO DORIA"
              onComplete={() => setIsReady(true)}
            />
            <SubHeader isReady={isReady} />
          </div>
        </section>

        <WorkSection />
      </main>
    </SmoothScroll>
  );
}
