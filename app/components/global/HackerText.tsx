"use client";

import { useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "01<>/[]{}#_*+=";
const TICK_MS = 40;
const STAGGER_MS = 30;
const LETTER_DURATION_MS = 150;

interface HackerTextProps {
    text: string;
}

function randomChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/**
 * A "hacker" text-scramble reveal, triggered on hover and on keyboard focus.
 * Each letter cycles through SCRAMBLE_CHARS and locks to its real character,
 * left to right. No library — a single interval drives every letter.
 */
export default function HackerText({ text }: HackerTextProps) {
    const rootRef = useRef<HTMLSpanElement>(null);
    const intervalRef = useRef<number | null>(null);
    const reduceMotionRef = useRef(false);

    const play = () => {
        if (reduceMotionRef.current) return;

        const root = rootRef.current;
        if (!root) return;

        // Re-hovering mid-animation restarts cleanly from here; leaving mid-animation
        // does nothing (no pointerleave handler), so it's left to finish on its own.
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
        }

        const letterEls = root.querySelectorAll<HTMLSpanElement>(".hacker-letter");
        const chars = text.split("");
        const timings = chars.map((char, i) => ({
            char,
            startAt: i * STAGGER_MS,
            resolveAt: i * STAGGER_MS + LETTER_DURATION_MS,
        }));

        const startTime = performance.now();

        intervalRef.current = window.setInterval(() => {
            const elapsed = performance.now() - startTime;
            let settled = 0;

            letterEls.forEach((el, i) => {
                const { char, startAt, resolveAt } = timings[i];

                if (char === " ") {
                    settled += 1;
                    return;
                }

                if (elapsed >= resolveAt) {
                    el.textContent = char;
                    settled += 1;
                } else if (elapsed >= startAt) {
                    el.textContent = randomChar();
                } else {
                    el.textContent = char;
                }
            });

            if (settled === timings.length && intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, TICK_MS);
    };

    useEffect(() => {
        reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const root = rootRef.current;
        if (!root) return;

        // Lock the box to its settled width once, so scrambling through glyphs of very
        // different natural widths (digits, symbols, letters) never resizes the button.
        // Waits for the real font so the lock isn't based on a fallback's metrics.
        const lockWidth = () => {
            root.style.width = `${root.getBoundingClientRect().width}px`;
        };
        if (document.fonts?.ready) {
            void document.fonts.ready.then(lockWidth);
        } else {
            lockWidth();
        }

        // The hoverable/focusable element is the surrounding <a>/<button>, not this
        // span (which is sized tightly to the text) — both listeners go on that
        // ancestor instead of here, so the animation triggers over the whole control.
        const focusTarget = root.closest<HTMLElement>("a, button") ?? root;
        const handleFocus = () => {
            if (focusTarget.matches(":focus-visible")) play();
        };
        focusTarget.addEventListener("focus", handleFocus);
        focusTarget.addEventListener("pointerenter", play);

        return () => {
            focusTarget.removeEventListener("focus", handleFocus);
            focusTarget.removeEventListener("pointerenter", play);
            if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span
            ref={rootRef}
            className="relative inline-flex"
            style={{ fontVariantNumeric: "tabular-nums" }}
        >
            <span aria-hidden="true" className="inline-flex">
                {text.split("").map((ch, i) => (
                    <span key={i} className="hacker-letter inline-block">
                        {ch === " " ? " " : ch}
                    </span>
                ))}
            </span>
            <span className="sr-only">{text}</span>
        </span>
    );
}
