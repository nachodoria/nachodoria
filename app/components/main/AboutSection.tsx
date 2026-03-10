"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    const text = "A passionate computer science student driven by curiosity, creativity, and a love for building meaningful things. I thrive in collaborative environments, turning projects into connections while solving problems with clarity and adaptability. I bring positive energy, teamwork, and a genuine drive to keep learning and growing.";

    const words = text.split(" ");

    useGSAP(() => {
        if (!textRef.current) return;

        const wordElements = textRef.current.querySelectorAll(".word");

        gsap.to(wordElements, {
            opacity: 1,
            duration: 1,
            stagger: 1,
            ease: "none",
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 85%",
                end: "bottom 60%",
                scrub: 1, // Smoother scrub
            }
        });
    }, { scope: sectionRef });

    return (
        <section
            id="about"
            ref={sectionRef}
            className="w-full min-h-[70vh] flex items-center justify-center py-40 px-[8vw] bg-[var(--background)]"
        >
            <p
                ref={textRef}
                className="text-[6vw] md:text-[4.5vw] lg:text-[4vw] font-sans font-medium leading-[1.15] tracking-tight text-[var(--foreground)] max-w-7xl"
            >
                {words.map((word, i) => (
                    <span key={i} className="word opacity-10 inline-block mr-[0.25em] will-change-[opacity]">
                        {word}
                    </span>
                ))}
            </p>
        </section>
    );
}
