"use client";

import { useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TICK_MS = 45;
const STAGGER_MS = 28;
const HOLD_MS = 280;

interface ScrambleTextProps {
    text: string;
}

function randomChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export default function ScrambleText({ text }: ScrambleTextProps) {
    const rootRef = useRef<HTMLSpanElement>(null);
    const intervalRef = useRef<number | null>(null);
    const supportsHoverRef = useRef(false);

    useEffect(() => {
        supportsHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        const root = rootRef.current;
        if (!root) return;

        // The hoverable element is the surrounding <a>/<button>, not this span (which
        // is sized tightly to the text) — the listener goes on that ancestor instead
        // of here, so the animation triggers over the whole control.
        const hoverTarget = root.closest<HTMLElement>("a, button") ?? root;
        hoverTarget.addEventListener("pointerenter", play);

        return () => {
            hoverTarget.removeEventListener("pointerenter", play);
            if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const play = () => {
        if (!supportsHoverRef.current) return;

        const root = rootRef.current;
        if (!root) return;

        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
        }

        const letterEls = root.querySelectorAll<HTMLSpanElement>(".scramble-letter");
        const chars = text.split("");

        // Lock each letter's box to its settled (resting) width before scrambling starts,
        // so swapping between the sans and monospace glyphs can never resize the pill.
        letterEls.forEach((el) => {
            const width = el.getBoundingClientRect().width;
            el.style.display = "inline-block";
            el.style.width = `${width}px`;
            el.style.textAlign = "center";
        });

        const cascadeInEnd = Math.max(0, chars.length - 1) * STAGGER_MS;

        const timings = chars.map((char, i) => ({
            char,
            startAt: i * STAGGER_MS,
            resolveAt: cascadeInEnd + HOLD_MS + i * STAGGER_MS,
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
                    el.classList.remove("is-scrambling");
                    settled += 1;
                } else if (elapsed >= startAt) {
                    el.textContent = randomChar();
                    el.classList.add("is-scrambling");
                } else {
                    el.textContent = char;
                    el.classList.remove("is-scrambling");
                }
            });

            if (settled === timings.length && intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
                letterEls.forEach((el) => {
                    el.style.width = "";
                });
            }
        }, TICK_MS);
    };

    return (
        <span ref={rootRef} className="relative inline-flex">
            <span aria-hidden="true" className="inline-flex">
                {text.split("").map((ch, i) => (
                    <span key={i} className="scramble-letter">
                        {ch === " " ? " " : ch}
                    </span>
                ))}
            </span>
            <span className="sr-only">{text}</span>
        </span>
    );
}
