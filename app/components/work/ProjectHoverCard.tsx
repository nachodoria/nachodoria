"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface ProjectHoverCardProps {
    children: React.ReactNode;
    panelColor?: string;
}

export default function ProjectHoverCard({
    children,
    panelColor = "var(--foreground)",
}: ProjectHoverCardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const supportsHoverRef = useRef(false);

    // Raw target values from mousemove (updated instantly)
    const mouse = useRef({ x: 0, y: 0 });
    // Current interpolated values (smoothly approach target)
    const current = useRef({ ctaX: 0, ctaY: 0, panelX: 0, panelY: 0 });
    const raf = useRef<number | null>(null);
    const isHovering = useRef(false);
    const startTickRef = useRef<() => void>(() => undefined);
    const motionPrefRef = useRef({
        ctaLerp: 0.08,
        ctaMaxDrift: 30,
        panelLerp: 0.06,
        panelStrength: -0.035,
    });

    useEffect(() => {
        const container = containerRef.current;
        const cta = ctaRef.current;
        if (!container || !cta) return;
        supportsHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        const applyTransforms = () => {
            cta.style.transform = `translate(-50%, -50%) translate(${current.current.ctaX}px, ${current.current.ctaY}px) scale(var(--cta-scale, 0))`;
            container.style.transform = `translate(${current.current.panelX}px, ${current.current.panelY}px)`;
        };

        const tick = () => {
            const { ctaLerp, ctaMaxDrift, panelLerp, panelStrength } = motionPrefRef.current;

            if (isHovering.current) {
                // CTA: calculate how far cursor is from center, clamp to small box
                const ctaTargetX = gsap.utils.clamp(-ctaMaxDrift, ctaMaxDrift, mouse.current.x * 0.15);
                const ctaTargetY = gsap.utils.clamp(-ctaMaxDrift, ctaMaxDrift, mouse.current.y * 0.15);
                current.current.ctaX += (ctaTargetX - current.current.ctaX) * ctaLerp;
                current.current.ctaY += (ctaTargetY - current.current.ctaY) * ctaLerp;

                // Entire panel: moves opposite to cursor
                const panelTargetX = mouse.current.x * panelStrength;
                const panelTargetY = mouse.current.y * panelStrength;
                current.current.panelX += (panelTargetX - current.current.panelX) * panelLerp;
                current.current.panelY += (panelTargetY - current.current.panelY) * panelLerp;
            } else {
                // When not hovering, ease everything back to center and stop RAF at rest.
                current.current.ctaX += (0 - current.current.ctaX) * ctaLerp;
                current.current.ctaY += (0 - current.current.ctaY) * ctaLerp;
                current.current.panelX += (0 - current.current.panelX) * panelLerp;
                current.current.panelY += (0 - current.current.panelY) * panelLerp;
            }

            applyTransforms();

            const isSettled =
                Math.abs(current.current.ctaX) < 0.05 &&
                Math.abs(current.current.ctaY) < 0.05 &&
                Math.abs(current.current.panelX) < 0.05 &&
                Math.abs(current.current.panelY) < 0.05;

            if (!isHovering.current && isSettled) {
                current.current = { ctaX: 0, ctaY: 0, panelX: 0, panelY: 0 };
                applyTransforms();
                raf.current = null;
                return;
            }

            raf.current = requestAnimationFrame(tick);
        };

        const startTick = () => {
            if (raf.current !== null) return;
            raf.current = requestAnimationFrame(tick);
        };
        startTickRef.current = startTick;

        return () => {
            if (raf.current !== null) {
                cancelAnimationFrame(raf.current);
            }
            startTickRef.current = () => undefined;
        };
    }, []);

    const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!supportsHoverRef.current || e.pointerType !== "mouse") return;

        const container = containerRef.current;
        const cta = ctaRef.current;
        if (!container || !cta) return;

        isHovering.current = true;
        startTickRef.current();

        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Store cursor offset from center
        mouse.current.x = e.clientX - rect.left - centerX;
        mouse.current.y = e.clientY - rect.top - centerY;

        // Animate CTA visible at center
        gsap.to(cta, {
            "--cta-scale": 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.4)",
            overwrite: true,
        });
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!supportsHoverRef.current || e.pointerType !== "mouse") return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Store cursor offset from CENTER — the RAF loop lerps toward this
        mouse.current.x = e.clientX - rect.left - centerX;
        mouse.current.y = e.clientY - rect.top - centerY;
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!supportsHoverRef.current || e.pointerType !== "mouse") return;

        const cta = ctaRef.current;
        if (!cta) return;

        isHovering.current = false;
        startTickRef.current();

        // Shrink CTA right where it is (don't move it)
        gsap.to(cta, {
            "--cta-scale": 0,
            opacity: 0,
            duration: 0.25,
            ease: "power3.in",
            overwrite: true,
        });

        // Image eases back to center via the RAF loop (isHovering = false path)
    };

    return (
        <div
            ref={containerRef}
            className="relative aspect-[16/10] overflow-hidden rounded-[0.5rem] shadow-[0_18px_45_rgba(0,0,0,0.14)] cursor-none will-change-transform md:rounded-[0.6rem]"
            style={{ backgroundColor: panelColor }}
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {children}

            {/* Black circle CTA — positioned from top-left corner, translated by lerp */}
            <div
                ref={ctaRef}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 items-center justify-center rounded-full bg-[#111] shadow-lg will-change-transform md:h-28 md:w-28"
                style={{ opacity: 0 } as React.CSSProperties}
            >
                {/* Horizontal scrolling "View more" ticker */}
                <div className="relative flex w-full overflow-hidden">
                    <div
                        className="flex w-max whitespace-nowrap text-[0.95rem] font-medium italic tracking-tight text-white md:text-[1.1rem]"
                        style={{
                            animation: "marquee-x 3s linear infinite",
                        }}
                    >
                        <span className="pr-12">View more</span>
                        <span className="pr-12">View more</span>
                        <span className="pr-12">View more</span>
                        <span className="pr-12">View more</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
