"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
    interface Window {
        __lenis?: Lenis;
    }
}

interface SmoothScrollProps {
    children: React.ReactNode;
}

/**
 * The single, site-wide Lenis instance — mounted once in the root layout so it
 * runs on every route. Never mount a second Lenis (or locomotive-scroll)
 * instance alongside this one; two smoothing engines fighting over the same
 * scroll position is what caused the previous "draggy" feel.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lenis = new Lenis({
            lerp: 0.2,
            wheelMultiplier: 1.25,
            smoothWheel: true,
            syncTouch: false,
        });

        window.__lenis = lenis;

        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            if (window.__lenis === lenis) {
                delete window.__lenis;
            }
        };
    }, []);

    return <>{children}</>;
}
