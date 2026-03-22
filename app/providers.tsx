"use client";

import { useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

export default function Providers({ children }: { children: React.ReactNode }) {
  const panel1 = useRef<HTMLDivElement>(null);
  const panel2 = useRef<HTMLDivElement>(null);
  const panel3 = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="transition-wrapper">
        <div ref={panel1} className="transition-panel panel-1"></div>
        <div ref={panel2} className="transition-panel panel-2"></div>
        <div ref={panel3} className="transition-panel panel-3"></div>
      </div>

      <TransitionRouter
        leave={(next) => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: next
          });

          tl.set([panel1.current, panel2.current, panel3.current], {
            y: "100%"
          });

          tl.to(panel1.current, {
            y: "0%",
            duration: 0.52
          });

          tl.to(panel2.current, {
            y: "0%",
            duration: 0.5
          }, "-=0.3");

          tl.to(panel3.current, {
            y: "0%",
            duration: 0.4
          }, "-=0.1");

          return () => {
            tl.kill();
          };
        }}

        enter={(next) => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
              gsap.set([panel1.current, panel2.current, panel3.current], {
                y: "100%"
              });
              next();
            }
          });

          tl.to(panel1.current, {
            y: "-100%",
            duration: 0.52
          });

          tl.to(panel2.current, {
            y: "-100%",
            duration: 0.3
          }, "-=0.4");

          tl.to(panel3.current, {
            y: "-100%",
            duration: 0.3
          }, "-=0.3");

          return () => {
            tl.kill();
          };
        }}
      >
        {children}
      </TransitionRouter>
    </>
  );
}
