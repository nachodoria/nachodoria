"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function AnimatedTitle({ text, onComplete }: { text: string; onComplete?: () => void }) {
    const container = useRef<HTMLHeadingElement>(null);

    useGSAP(
        () => {
            if (!container.current) return;
            const parent = container.current.parentElement;
            if (!parent) return;

            const tl = gsap.timeline({
                delay: 0.5,
                onComplete: () => onComplete?.()
            });

            // Step 1: Reveal from bottom
            tl.from(".word", {
                y: "115%",
                duration: 0.8,
                ease: "expo.out",
                force3D: true
            });

            // Step 2: Expand font size
            tl.to(container.current, {
                fontSize: "14vw",
                letterSpacing: "-0.05em",
                duration: 0.8,
                ease: "expo.out",
                force3D: true
            }, "-=0.1");

            // Step 3: Move Title + SubHeader block to top
            tl.to(parent, {
                y: "-25vh",
                duration: 1.2,
                ease: "expo.out",
                force3D: true
            }, "-=0.1");
        },
        { scope: container }
    );

    return (
        <h1
            ref={container}
            data-scroll
            data-scroll-speed="0.3"
            className="flex whitespace-nowrap text-6xl md:text-8xl font-sans font-bold tracking-tighter text-[var(--foreground)] drop-shadow-sm select-none will-change-[font-size,transform]"
        >
            {text.split(" ").map((word, i) => (
                <span key={i} className="relative inline-block overflow-hidden py-4 px-2 -my-4 -mx-2">
                    <span className="word inline-block translate-y-0 will-change-transform">
                        {word}
                    </span>
                    {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
    );
}