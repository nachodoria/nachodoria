"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["move", "idea", "project", "vision"];
const TYPING_SPEED = 80;
const PAUSE_DURATION = 1500;
const DELETING_SPEED = 40;
const WORD_SWITCH_DELAY = 220;
const LONGEST_WORD = WORDS.reduce((longest, word) => (
    word.length > longest.length ? word : longest
), WORDS[0]);

export default function HeroText() {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const [wordIndex, setWordIndex] = useState(0);
    const [displayedWord, setDisplayedWord] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                rootMargin: "180px 0px",
                threshold: 0.15,
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const target = WORDS[wordIndex];
        let timeoutId: ReturnType<typeof setTimeout>;

        if (!isDeleting && displayedWord.length < target.length) {
            timeoutId = setTimeout(() => {
                setDisplayedWord(target.slice(0, displayedWord.length + 1));
            }, TYPING_SPEED);
        } else if (!isDeleting && displayedWord === target) {
            timeoutId = setTimeout(() => {
                setIsDeleting(true);
            }, PAUSE_DURATION);
        } else if (isDeleting && displayedWord.length > 0) {
            timeoutId = setTimeout(() => {
                setDisplayedWord(displayedWord.slice(0, -1));
            }, DELETING_SPEED);
        } else {
            timeoutId = setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((current) => (current + 1) % WORDS.length);
            }, WORD_SWITCH_DELAY);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [displayedWord, isDeleting, isVisible, wordIndex]);

    return (
        <p
            ref={containerRef}
            className="mt-16 font-sans text-[18vw] font-semibold leading-none tracking-tight text-[var(--foreground)] sm:mt-24 sm:text-[15vw] md:mt-28 md:text-[6.5vw]"
        >
            <span>Your </span>
            <span className="inline-grid align-baseline">
                <span
                    aria-hidden="true"
                    className="pointer-events-none invisible col-start-1 row-start-1 select-none whitespace-nowrap"
                >
                    {LONGEST_WORD}
                </span>
                <span className="col-start-1 row-start-1 inline-flex items-baseline whitespace-nowrap">
                    <span>{displayedWord}</span>
                    <span aria-hidden="true" className="typewriter-cursor">|</span>
                </span>
            </span>
        </p>
    );
}
