"use client";

import { useEffect } from "react";
import gsap from "gsap";

interface PortfolioLocomotive {
    start?: () => void;
    stop?: () => void;
    destroy?: () => void;
    scrollTo?: (target: number | HTMLElement | string, options?: Record<string, unknown>) => void;
}

type CustomTickerRender = (...args: unknown[]) => void;

declare global {
    interface Window {
        __portfolioLocomotive?: PortfolioLocomotive;
    }
}

interface SmoothScrollProps {
    children: React.ReactNode;
    enabled: boolean;
}

interface RgbColor {
    r: number;
    g: number;
    b: number;
}

const HERO_BG_START = "#5ea85d";
const HERO_BG_END = "#ffffeb";
const HERO_TITLE_START = "#ffffeb";
const HERO_TITLE_END = "#112712";
const THEME_EASE_START = 90;
const THEME_EASE_DISTANCE = 520;

const hexToRgb = (hex: string): RgbColor => {
    const normalized = hex.replace("#", "");
    const value = Number.parseInt(normalized, 16);

    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
};

const toHex = (value: number) => value.toString(16).padStart(2, "0");

const mixHexColor = (from: string, to: string, progress: number) => {
    const start = hexToRgb(from);
    const end = hexToRgb(to);
    const blend = (startChannel: number, endChannel: number) =>
        Math.round(startChannel + (endChannel - startChannel) * progress);

    return `#${toHex(blend(start.r, end.r))}${toHex(blend(start.g, end.g))}${toHex(blend(start.b, end.b))}`;
};

const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function SmoothScroll({ children, enabled }: SmoothScrollProps) {
    useEffect(() => {
        if (!enabled) return;

        let isMounted = true;
        let locomotiveScroll: PortfolioLocomotive | undefined;
        let isInitializing = false;
        let hadInitFailure = false;
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
        let themeRafId: number | null = null;
        let queuedScrollY = window.scrollY;
        let lastThemeProgress = -1;

        const rootStyle = document.documentElement.style;
        const canDragScroll = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
        const easing = (t: number) => 1 - Math.pow(1 - t, 3);

        const applyThemeByScroll = (scrollY: number) => {
            const rawProgress = clamp((scrollY - THEME_EASE_START) / THEME_EASE_DISTANCE, 0, 1);
            const easedProgress = easeInOutCubic(rawProgress);

            if (Math.abs(easedProgress - lastThemeProgress) < 0.004) return;
            lastThemeProgress = easedProgress;

            const background = mixHexColor(HERO_BG_START, HERO_BG_END, easedProgress);
            const heroTitle = mixHexColor(HERO_TITLE_START, HERO_TITLE_END, easedProgress);

            rootStyle.setProperty("--background", background);
            rootStyle.setProperty("--background-o", withAlpha(background, "88"));
            rootStyle.setProperty("--hero-title-color", heroTitle);
            rootStyle.setProperty("--hero-title-dim", withAlpha(heroTitle, "bf"));
        };

        const flushThemeUpdate = () => {
            themeRafId = null;
            applyThemeByScroll(queuedScrollY);
        };

        const scheduleThemeUpdate = (scrollY: number) => {
            queuedScrollY = scrollY;
            if (themeRafId !== null) return;
            themeRafId = window.requestAnimationFrame(flushThemeUpdate);
        };

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

        const loadLocomotive = async () => {
            if (!isMounted || locomotiveScroll || isInitializing) return;

            if (typeof navigator !== "undefined" && !navigator.onLine) {
                hadInitFailure = true;
                return;
            }

            isInitializing = true;

            try {
                const LocomotiveScroll = (await import("locomotive-scroll")).default;

                if (!isMounted) return;

                const instance = new LocomotiveScroll({
                    lenisOptions: {
                        lerp: isCoarsePointer ? 0.09 : 0.065,
                        duration: isCoarsePointer ? 1.05 : 1.15,
                        easing,
                        smoothWheel: true,
                        syncTouch: true,
                        syncTouchLerp: 0.085,
                        gestureOrientation: "vertical",
                        touchMultiplier: 1,
                        wheelMultiplier: 0.95,
                        autoResize: true,
                        overscroll: true,
                    },
                    scrollCallback: ({ scroll, limit }) => {
                        currentScroll = scroll;
                        scrollLimit = limit;
                        scheduleThemeUpdate(scroll);
                    },
                    initCustomTicker: (render: CustomTickerRender) => {
                        gsap.ticker.add(render);
                    },
                    destroyCustomTicker: (render: CustomTickerRender) => {
                        gsap.ticker.remove(render);
                    },
                });

                if (!isMounted) {
                    instance.destroy();
                    return;
                }

                locomotiveScroll = instance;
                hadInitFailure = false;
                window.__portfolioLocomotive = instance;
            } catch (error) {
                hadInitFailure = true;

                if (process.env.NODE_ENV !== "production") {
                    console.warn("[SmoothScroll] Failed to initialize locomotive-scroll.", error);
                }
            } finally {
                isInitializing = false;
            }
        };

        const handleOnline = () => {
            if (!hadInitFailure || locomotiveScroll) return;
            void loadLocomotive();
        };

        const handleWindowScroll = () => {
            if (locomotiveScroll) return;
            scheduleThemeUpdate(window.scrollY);
        };

        window.addEventListener("portfolio-scroll-stop", handleStop);
        window.addEventListener("portfolio-scroll-start", handleStart);
        window.addEventListener("online", handleOnline);
        window.addEventListener("scroll", handleWindowScroll, { passive: true });
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointermove", handlePointerMove, { passive: false });
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
        window.addEventListener("click", handleClickCapture, true);

        scheduleThemeUpdate(window.scrollY);
        void loadLocomotive();

        return () => {
            isMounted = false;
            releaseDrag();
            window.removeEventListener("portfolio-scroll-stop", handleStop);
            window.removeEventListener("portfolio-scroll-start", handleStart);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("scroll", handleWindowScroll);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
            window.removeEventListener("click", handleClickCapture, true);

            if (themeRafId !== null) {
                window.cancelAnimationFrame(themeRafId);
            }

            if (window.__portfolioLocomotive === locomotiveScroll) {
                delete window.__portfolioLocomotive;
            }

            locomotiveScroll?.destroy?.();
        };
    }, [enabled]);

    return <>{children}</>;
}
