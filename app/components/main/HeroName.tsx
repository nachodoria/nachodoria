"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HeroNameProps {
    onComplete?: () => void;
    skipAnimation?: boolean;
}

const WORDS = ["Ignacio", "Doria"];

export default function HeroName({ onComplete, skipAnimation = false }: HeroNameProps) {
    const containerRef = useRef<HTMLHeadingElement>(null);

    useGSAP(
        () => {
            const words = containerRef.current?.querySelectorAll<HTMLElement>(".hero-name-word");
            if (!words?.length) return;

            if (skipAnimation) {
                gsap.set(words, { y: 0, opacity: 1 });
                onComplete?.();
                return;
            }

            gsap.fromTo(
                words,
                { y: 24, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power3.out",
                    onComplete: () => onComplete?.(),
                }
            );
        },
        { scope: containerRef, dependencies: [skipAnimation] }
    );

    return (
        <h1
            ref={containerRef}
            className="font-display uppercase leading-[0.95] tracking-[-0.03em] text-[var(--ink)] text-[clamp(3.5rem,13vw,12rem)]"
        >
            {WORDS.map((word) => (
                <span key={word} className="hero-name-word block">
                    {word}
                </span>
            ))}
        </h1>
    );
}
