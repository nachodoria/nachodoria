"use client";

import { RefObject, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface UsePageTransitionOptions {
    scopeRef: RefObject<HTMLElement | null>;
    onBeforeNavigate?: () => void;
}

export function usePageTransition({ scopeRef, onBeforeNavigate }: UsePageTransitionOptions) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const transitionTo = (href: string) => {
        if (isTransitioning) return;

        const html = document.documentElement;
        const body = document.body;

        onBeforeNavigate?.();
        window.dispatchEvent(new CustomEvent("portfolio-scroll-stop"));
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.pointerEvents = "none";

        const scope = scopeRef.current;

        if (!scope) {
            router.push(href, { scroll: false });
            return;
        }

        setIsTransitioning(true);

        const navItems = gsap.utils.toArray<HTMLElement>(document.querySelectorAll(".page-transition-nav"));
        const textItems = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(".page-transition-text"));
        const visualItems = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(".page-transition-visual"));
        const fallbackItems = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(".page-transition-item"));

        const tl = gsap.timeline({
            defaults: {
                overwrite: "auto",
            },
            onComplete: () => {
                router.push(href, { scroll: false });
            },
        });

        const allItems = [...navItems, ...textItems, ...visualItems];

        if (allItems.length > 0) {
            tl.to(allItems, {
                y: -36,
                opacity: 0,
                duration: 0.62,
                ease: "power3.out",
                stagger: 0.06,
            }, 0);
        } else {
            tl.to(fallbackItems, {
                y: -36,
                opacity: 0,
                duration: 0.62,
                ease: "power3.out",
                stagger: 0.06,
            }, 0);
        }

        tl.to({}, {
            duration: 0.18,
        });
    };

    return { isTransitioning, transitionTo };
}
