"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlightedWords = new Set([
    "software",
    "developer",
    "real",
    "problems",
    "new",
    "ideas",
    "grow",
    "handson",
]);

const aboutText = "Aspiring software developer focused on building reliable systems and solving real problems through code. Always exploring new ideas and looking for opportunities to grow through hands-on experience in the industry.";
const aboutWords = aboutText.split(" ");

export default function AboutSection({ isReady = true }: { isReady?: boolean }) {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        if (!textRef.current) return;

        const wordElements = Array.from(textRef.current.querySelectorAll<HTMLElement>(".word"));
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 85%",
                end: "bottom 60%",
                scrub: 1,
            },
        });

        wordElements.forEach((wordElement, index) => {
            const isHighlighted = wordElement.dataset.highlighted === "true";
            timeline.to(wordElement, {
                opacity: isHighlighted ? 1 : 0.56,
                duration: 1,
                ease: "none",
            }, index);
        });
    }, { scope: sectionRef });

    useGSAP(() => {
        if (isReady && sectionRef.current) {
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    clearProps: "transform",
                }
            );
        } else if (sectionRef.current && !isReady) {
            gsap.set(sectionRef.current, { opacity: 0, y: 40 });
        }
    }, [isReady]);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="w-full min-h-[58vh] -mt-[15vh] flex items-start justify-center px-[6vw] pt-8 pb-20 md:-mt-[20vh] md:px-[8vw] md:pt-14 md:pb-32 opacity-0"
        >
            <p
                ref={textRef}
                className="max-w-7xl font-sans text-[9vw] font-medium leading-[1.12] tracking-tight text-[var(--foreground)] sm:text-[7.8vw] md:text-[4.5vw] lg:text-[4vw]"
            >
                {aboutWords.map((word, i) => {
                    const normalizedWord = word.toLowerCase().replace(/[^a-z]/g, "");
                    const isHighlighted = highlightedWords.has(normalizedWord);

                    return (
                        <span
                            key={i}
                            data-highlighted={isHighlighted ? "true" : "false"}
                            className={`word inline-block mr-[0.25em] opacity-20 will-change-[opacity,color] ${isHighlighted ? "word-highlight" : ""}`}
                            style={isHighlighted ? { color: "var(--foreground-secondary)" } : undefined}
                        >
                            {word}
                        </span>
                    );
                })}
            </p>
        </section>
    );
}
