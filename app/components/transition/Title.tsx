"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useTransitionState } from "next-transition-router";
import { gsap } from "gsap";

interface TitleProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function Title({ children, className = "", delay = 0 }: TitleProps) {
    const ref = useRef<HTMLHeadingElement | null>(null);
    const { isReady } = useTransitionState();

    const words = useMemo(() => {
        if (typeof children === "string") {
            return children.split(" ").filter(Boolean);
        }

        return null;
    }, [children]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const wordWrappers = ref.current?.querySelectorAll<HTMLElement>("span[data-title-word]") ?? [];
            const chars = ref.current?.querySelectorAll<HTMLElement>("span[data-title-char]") ?? [];

            gsap.set(ref.current, {
                autoAlpha: 0,
            });

            // Each character starts translated down, rotated, and slightly scaled
            gsap.set(chars, {
                yPercent: 120,
                rotateX: -80,
                scaleY: 0.6,
                opacity: 0,
            });

            if (!isReady) {
                return;
            }

            const tl = gsap.timeline({
                delay,
            });

            // Reveal the container
            tl.set(ref.current, {
                autoAlpha: 1,
            });

            // Animate each character with a cascading stagger
            tl.to(chars, {
                yPercent: 0,
                rotateX: 0,
                scaleY: 1,
                opacity: 1,
                duration: 0.9,
                ease: "expo.out",
                stagger: {
                    each: 0.035,
                },
            });
        }, ref);

        return () => {
            ctx.revert();
        };
    }, [delay, isReady, words]);

    if (!words) {
        return (
            <h1 ref={ref} className={className}>
                {children}
            </h1>
        );
    }

    return (
        <h1 ref={ref} className={className} style={{ perspective: "600px" }}>
            {words.map((word, wordIndex) => (
                <span
                    key={`${word}-${wordIndex}`}
                    data-title-word
                    className="mr-[0.18em] inline-block align-top last:mr-0"
                >
                    {word.split("").map((char, charIndex) => (
                        <span
                            key={`${char}-${charIndex}`}
                            className="inline-block overflow-hidden"
                        >
                            <span
                                data-title-char
                                className="inline-block will-change-transform"
                                style={{ transformOrigin: "bottom center" }}
                            >
                                {char}
                            </span>
                        </span>
                    ))}
                </span>
            ))}
        </h1>
    );
}
