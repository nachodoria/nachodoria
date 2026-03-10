"use client";

import { useEffect } from "react";
import gsap from "gsap";

declare global {
    interface Window {
        __portfolioLocomotive?: {
            start?: () => void;
            stop?: () => void;
            destroy?: () => void;
            scrollTo?: (target: number | HTMLElement | string, options?: Record<string, unknown>) => void;
        };
    }
}

interface SmoothScrollProps {
    children: React.ReactNode;
    enabled: boolean;
}

export default function SmoothScroll({ children, enabled }: SmoothScrollProps) {
    useEffect(() => {
        if (!enabled) return;

        let isMounted = true;
        let locomotiveScroll: any;
        let isScrollStopped = false;
        let currentScroll = window.scrollY;
        let scrollLimit = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight,
        );
        let isPointerDown = false;
        let isDragging = false;
        let suppressClick = false;
        let pointerStartY = 0;
        let dragStartScroll = 0;

        const canDragScroll = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
        const easing = (t: number) => 1 - Math.pow(1 - t, 3);

        const releaseDrag = () => {
            isPointerDown = false;
            isDragging = false;
            document.body.style.userSelect = "";
        };

        const handleStop = () => {
            isScrollStopped = true;
            releaseDrag();
            locomotiveScroll?.stop?.();
        };

        const handleStart = () => {
            isScrollStopped = false;
            locomotiveScroll?.start?.();
        };

        const handlePointerDown = (event: PointerEvent) => {
            if (!canDragScroll || isScrollStopped || event.button !== 0) return;

            const target = event.target as HTMLElement | null;
            if (target?.closest("input, textarea, select, option, [contenteditable='true'], [data-no-drag-scroll='true']")) {
                return;
            }

            isPointerDown = true;
            isDragging = false;
            pointerStartY = event.clientY;
            dragStartScroll = currentScroll;
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (!isPointerDown || !locomotiveScroll?.scrollTo) return;

            const deltaY = event.clientY - pointerStartY;
            if (!isDragging && Math.abs(deltaY) < 6) return;

            if (!isDragging) {
                isDragging = true;
                suppressClick = true;
                document.body.style.userSelect = "none";
            }

            event.preventDefault();

            const nextScroll = clamp(dragStartScroll - deltaY, 0, scrollLimit);
            locomotiveScroll.scrollTo(nextScroll, {
                duration: 1.15,
                lerp: 0.12,
                easing,
                force: true,
            });
        };

        const handlePointerUp = () => {
            if (!isPointerDown) return;

            releaseDrag();

            if (suppressClick) {
                window.setTimeout(() => {
                    suppressClick = false;
                }, 0);
            }
        };

        const handleClickCapture = (event: MouseEvent) => {
            if (!suppressClick) return;

            event.preventDefault();
            event.stopPropagation();
            suppressClick = false;
        };

        window.addEventListener("portfolio-scroll-stop", handleStop);
        window.addEventListener("portfolio-scroll-start", handleStart);
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointermove", handlePointerMove, { passive: false });
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
        window.addEventListener("click", handleClickCapture, true);

        (async () => {
            const LocomotiveScroll = (await import("locomotive-scroll")).default;

            const instance = new LocomotiveScroll({
                lenisOptions: {
                    lerp: 0.12,
                    duration: 1.35,
                    smoothWheel: true,
                    easing,
                },
                scrollCallback: ({ scroll, limit }) => {
                    currentScroll = scroll;
                    scrollLimit = limit;
                },
                initCustomTicker: (render: any) => {
                    gsap.ticker.add(render);
                },
                destroyCustomTicker: (render: any) => {
                    gsap.ticker.remove(render);
                },
            });

            if (!isMounted) {
                instance.destroy();
                return;
            }

            locomotiveScroll = instance;
            window.__portfolioLocomotive = instance;
        })();

        return () => {
            isMounted = false;
            releaseDrag();
            window.removeEventListener("portfolio-scroll-stop", handleStop);
            window.removeEventListener("portfolio-scroll-start", handleStart);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
            window.removeEventListener("click", handleClickCapture, true);

            if (window.__portfolioLocomotive === locomotiveScroll) {
                delete window.__portfolioLocomotive;
            }

            if (locomotiveScroll) locomotiveScroll.destroy();
        };
    }, [enabled]);

    return <>{children}</>;
}
