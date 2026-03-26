"use client";

import { ComponentProps, useLayoutEffect, useRef } from "react";
import { useTransitionState } from "next-transition-router";
import { gsap } from "gsap";

interface RevealProps extends ComponentProps<"div"> {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "right" | "left";
    distance?: number;
    imageScale?: number;
    /** Animation variant: "slide" (default), "fade", "clip" */
    variant?: "slide" | "fade" | "clip";
}

export function Reveal({
    children,
    delay = 0,
    direction = "up",
    distance = 24,
    imageScale = 1,
    variant = "slide",
    className,
    ...rest
}: RevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const { isReady } = useTransitionState();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const el = ref.current;
            if (!el) return;

            const initialX = direction === "right" ? distance : direction === "left" ? -distance : 0;
            const initialY = direction === "up" ? distance : 0;

            // Set initial hidden state based on variant
            if (variant === "clip") {
                // Clip-reveal: element stays in place but mask sweeps open
                const clipFrom = direction === "right"
                    ? "inset(0 100% 0 0)"
                    : direction === "left"
                        ? "inset(0 0 0 100%)"
                        : "inset(100% 0 0 0)";

                gsap.set(el, {
                    clipPath: clipFrom,
                    autoAlpha: 1,
                });
            } else if (variant === "fade") {
                // Pure fade with a subtle scale
                gsap.set(el, {
                    autoAlpha: 0,
                    scale: 0.97,
                    filter: "blur(6px)",
                });
            } else {
                // Default slide
                gsap.set(el, {
                    autoAlpha: 0,
                    x: initialX,
                    y: initialY,
                });
            }

            const images = el.querySelectorAll("img") ?? [];
            if (images.length > 0) {
                gsap.set(images, { scale: imageScale });
            }

            if (!isReady) {
                return;
            }

            const timeline = gsap.timeline({ delay });

            if (variant === "clip") {
                timeline.to(el, {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 0.9,
                    ease: "power4.inOut",
                });
            } else if (variant === "fade") {
                timeline.to(el, {
                    autoAlpha: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power2.out",
                });
            } else {
                timeline.to(el, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "expo.out",
                });
            }

            if (images.length > 0) {
                timeline.to(images, {
                    scale: 1,
                    duration: 1.0,
                    ease: "expo.out",
                    stagger: 0,
                }, 0);
            }
        }, ref);

        return () => {
            ctx.revert();
        };
    }, [delay, direction, distance, imageScale, isReady, variant]);

    return (
        <div ref={ref} className={className} {...rest}>
            {children}
        </div>
    );
}
