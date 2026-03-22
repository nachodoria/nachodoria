"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

interface AnimatedTitleProps {
    text: string;
    onComplete?: () => void;
    skipAnimation?: boolean;
}

const HOVER_FONTS = [
    "var(--font-corben)",
    "var(--font-chicle)",
    "var(--font-caprasimo)",
    "var(--font-yellowtail)",
    "var(--font-young-serif)",
    "var(--font-righteous)",
    "var(--font-dorsa)",
    "var(--font-ranchers)",
    "var(--font-smokum)",
];

const HOVER_RESET_DELAY = 300;

function TitleLetter({ char, hoverEnabled }: { char: string; hoverEnabled: boolean }) {
    const baseRef = useRef<HTMLSpanElement>(null);
    const widthCacheRef = useRef<Map<string, number>>(new Map());
    const resetTimeoutRef = useRef<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [hoverFont, setHoverFont] = useState<string>(HOVER_FONTS[0]);
    const [hoverScale, setHoverScale] = useState(1);
    const [hoverWidth, setHoverWidth] = useState<number | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current !== null) {
                window.clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    const measureFontWidth = (fontFamily: string) => {
        if (!baseRef.current) return 0;

        const styles = window.getComputedStyle(baseRef.current);
        const cacheKey = [
            char,
            fontFamily,
            styles.fontSize,
            styles.fontWeight,
            styles.fontStyle,
        ].join("|");
        const cachedWidth = widthCacheRef.current.get(cacheKey);
        if (cachedWidth !== undefined) {
            return cachedWidth;
        }

        const probe = document.createElement("span");
        probe.textContent = char;
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        probe.style.pointerEvents = "none";
        probe.style.whiteSpace = "pre";
        probe.style.fontSize = styles.fontSize;
        probe.style.fontWeight = styles.fontWeight;
        probe.style.fontStyle = styles.fontStyle;
        probe.style.lineHeight = styles.lineHeight;
        probe.style.textTransform = styles.textTransform;
        probe.style.fontFamily = fontFamily;
        probe.style.padding = "0";
        probe.style.margin = "0";

        document.body.appendChild(probe);
        const width = probe.getBoundingClientRect().width;
        document.body.removeChild(probe);
        widthCacheRef.current.set(cacheKey, width);

        return width;
    };

    const handleMouseEnter = () => {
        if (!hoverEnabled || !baseRef.current) return;

        if (resetTimeoutRef.current !== null) {
            window.clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }

        const nextFont = HOVER_FONTS[Math.floor(Math.random() * HOVER_FONTS.length)];
        const baseWidth = baseRef.current.getBoundingClientRect().width;
        const nextWidth = measureFontWidth(nextFont);
        setHoverFont(nextFont);
        setHoverScale(nextWidth > 0 ? Math.min(1, baseWidth / nextWidth) : 1);
        setHoverWidth(baseWidth);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (resetTimeoutRef.current !== null) {
            window.clearTimeout(resetTimeoutRef.current);
        }

        resetTimeoutRef.current = window.setTimeout(() => {
            setIsHovered(false);
            setHoverWidth(null);
            setHoverScale(1);
            resetTimeoutRef.current = null;
        }, HOVER_RESET_DELAY);
    };

    return (
        <span
            className="relative inline-flex align-baseline leading-none"
            style={isHovered && hoverWidth ? { width: `${hoverWidth}px` } : undefined}
        >
            <span
                ref={baseRef}
                className="inline-flex leading-none"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ opacity: isHovered ? 0 : 1 }}
            >
                {char}
            </span>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-end justify-center whitespace-pre leading-none"
                style={{
                    opacity: isHovered ? 1 : 0,
                    fontFamily: hoverFont,
                    transform: `scaleX(${hoverScale})`,
                    transformOrigin: "center center",
                }}
            >
                {char}
            </span>
        </span>
    );
}

export default function AnimatedTitle({ text, onComplete, skipAnimation = false }: AnimatedTitleProps) {
    const container = useRef<HTMLHeadingElement>(null);
    const [canHover, setCanHover] = useState(false);
    const [titleSettled, setTitleSettled] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
        const syncHoverAvailability = () => {
            setCanHover(mediaQuery.matches);
        };

        syncHoverAvailability();
        mediaQuery.addEventListener("change", syncHoverAvailability);

        return () => {
            mediaQuery.removeEventListener("change", syncHoverAvailability);
        };
    }, []);

    useGSAP(
        () => {
            if (!container.current) return;
            const parent = container.current.parentElement;
            if (!parent) return;

            const finishTitleAnimation = () => {
                onComplete?.();
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setTitleSettled(true);
                    });
                });
            };

            if (skipAnimation) {
                gsap.set(container.current, {
                    fontSize: "14vw",
                    letterSpacing: "-0.05em",
                });
                gsap.set(parent, {
                    y: "-25vh",
                });
                finishTitleAnimation();
                return;
            }

            const tl = gsap.timeline({
                delay: 0.5,
                onComplete: finishTitleAnimation
            });

            // Step 1: Reveal from bottom
            tl.from(".word", {
                y: "115%",
                duration: 0.8,
                ease: "expo.out",
                force3D: true
            });

            // Step 2: Expand font size
            tl.to(container.current, {
                fontSize: "14vw",
                letterSpacing: "-0.05em",
                duration: 0.8,
                ease: "expo.out",
                force3D: true
            }, "-=0.1");

            // Step 3: Move Title + SubHeader block to top
            tl.to(parent, {
                y: "-25vh",
                duration: 1.2,
                ease: "expo.out",
                force3D: true
            }, "-=0.1");
        },
        { scope: container, dependencies: [skipAnimation] }
    );

    const hoverEnabled = canHover && titleSettled;

    return (
        <h1
            ref={container}
            data-scroll
            data-scroll-speed="0.3"
            className="flex whitespace-nowrap text-6xl md:text-8xl font-sans font-bold tracking-tighter leading-none text-[var(--foreground)] drop-shadow-sm select-none will-change-[font-size,transform]"
        >
            {text.split(" ").map((word, i) => (
                <span
                    key={i}
                    className={`relative inline-block ${titleSettled ? "overflow-visible" : "overflow-hidden"}`}
                >
                    <span className="word inline-flex translate-y-0 will-change-transform">
                        {word.split("").map((char, index) => (
                            <TitleLetter
                                key={`${word}-${index}-${char}`}
                                char={char}
                                hoverEnabled={hoverEnabled}
                            />
                        ))}
                    </span>
                    {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
    );
}
