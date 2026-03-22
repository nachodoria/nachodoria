"use client";

import { ComponentProps, useLayoutEffect, useRef } from "react";
import { useTransitionState } from "next-transition-router";
import { gsap } from "gsap";

interface RevealProps extends ComponentProps<"div"> {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "right";
    distance?: number;
    imageScale?: number;
}

export function Reveal({
    children,
    delay = 0,
    direction = "up",
    distance = 24,
    imageScale = 1,
    className,
    ...rest
}: RevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const { isReady } = useTransitionState();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const initialX = direction === "right" ? distance : 0;
            const initialY = direction === "up" ? distance : 0;

            gsap.set(ref.current, {
                autoAlpha: 0,
                x: initialX,
                y: initialY,
            });

            const images = ref.current?.querySelectorAll("img") ?? [];
            if (images.length > 0) {
                gsap.set(images, { scale: imageScale });
            }

            if (!isReady) {
                return;
            }

            const timeline = gsap.timeline({
                delay,
                defaults: {
                    ease: "power3.out",
                },
            });

            timeline.to(ref.current, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.6,
            });

            if (images.length > 0) {
                timeline.to(images, {
                    scale: 1,
                    duration: 0.8,
                    ease: "expo.out",
                    stagger: 0,
                }, 0);
            }
        }, ref);

        return () => {
            ctx.revert();
        };
    }, [delay, direction, distance, imageScale, isReady]);

    return (
        <div ref={ref} className={className} {...rest}>
            {children}
        </div>
    );
}
