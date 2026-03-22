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
            const spans = ref.current?.querySelectorAll("span[data-title-word]") ?? [];

            gsap.set(ref.current, {
                autoAlpha: 0,
            });
            gsap.set(spans, {
                yPercent: 110,
            });

            if (!isReady) {
                return;
            }

            gsap.timeline({
                delay,
                defaults: {
                    ease: "circ.out",
                },
            })
                .set(ref.current, {
                    autoAlpha: 1,
                })
                .to(spans, {
                    yPercent: 0,
                    duration: 0.6,
                    stagger: {
                        each: 0.12,
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
        <h1 ref={ref} className={className}>
            {words.map((word, index) => (
                <span key={`${word}-${index}`} className="mr-[0.18em] inline-block overflow-hidden align-top last:mr-0">
                    <span data-title-word className="inline-block">
                        {word}
                    </span>
                </span>
            ))}
        </h1>
    );
}
