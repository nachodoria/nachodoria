"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useCallback, useRef } from "react";

gsap.registerPlugin(ScrollToPlugin);

interface NavbarProps {
    isReady: boolean;
}

export default function Navbar({ isReady }: NavbarProps) {
    const container = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const introComplete = useRef(false);

    const navItems = [
        { label: "About", target: "top" },
        { label: "Work", target: "#work-section" },
        { label: "Contact", target: "#contact" },
    ];

    const handleNavClick = (target: string) => {
        const smoothScroll = window.__portfolioLocomotive;

        const cubicInOut = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        if (target === "top") {
            if (smoothScroll?.scrollTo) {
                smoothScroll.scrollTo(0, {
                    duration: 1.2,
                    lerp: 0.05,
                    easing: cubicInOut,
                    force: true,
                });
                return;
            }

            gsap.killTweensOf(window);
            gsap.to(window, {
                duration: 1.2,
                ease: "power3.inOut",
                scrollTo: {
                    y: 0,
                    autoKill: false,
                },
                overwrite: "auto",
            });
            return;
        }

        const targetEl = document.querySelector(target);
        if (!targetEl) return;

        if (smoothScroll?.scrollTo) {
            smoothScroll.scrollTo(targetEl as HTMLElement, {
                duration: 1.2,
                lerp: 0.05,
                easing: cubicInOut,
                force: true,
            });
            return;
        }

        gsap.killTweensOf(window);
        gsap.to(window, {
            duration: 1.2,
            ease: "power3.inOut",
            scrollTo: {
                y: targetEl,
                autoKill: false,
            },
            overwrite: "auto",
        });
    };

    const handlePointerEnter = useCallback(
        (event: React.PointerEvent<HTMLButtonElement>, label: string) => {
            if (event.pointerType !== "mouse") return;
            if (!introComplete.current) return;

            const btn = itemRefs.current[label];
            if (!btn) return;

            gsap.to(btn, {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        },
        []
    );

    const handlePointerLeave = useCallback(
        (event: React.PointerEvent<HTMLButtonElement>, label: string) => {
            if (event.pointerType !== "mouse") return;
            if (!introComplete.current) return;

            const btn = itemRefs.current[label];
            if (!btn) return;

            gsap.to(btn, {
                opacity: 0.8,
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        },
        []
    );

    // Intro animation: stagger items sliding down and fading to 0.8
    useGSAP(() => {
        if (isReady && container.current) {
            const navButtons =
                container.current.querySelectorAll<HTMLElement>(".nav-item");

            introComplete.current = false;

            gsap.set(container.current, {
                "--nav-active": "var(--foreground)",
                backgroundColor: "transparent",
            });

            gsap.fromTo(
                navButtons,
                {
                    opacity: 0,
                    y: -20,
                },
                {
                    opacity: 0.8,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power4.out",
                    delay: 0.1,
                    force3D: true,
                    onComplete: () => {
                        introComplete.current = true;
                    },
                }
            );
        }
    }, [isReady]);

    return (
        <nav
            ref={container}
            className="fixed top-0 left-0 z-[100] flex h-16 w-full items-center justify-center gap-5 px-4 font-sans text-sm font-medium tracking-tight sm:text-base md:h-[12vh] md:justify-end md:gap-10 md:px-[5vw] md:text-xl pointer-events-none"
        >
            <div className="relative flex items-center gap-5 sm:gap-6 md:gap-10 pointer-events-auto">
                {navItems.map(({ label, target }) => (
                    <button
                        type="button"
                        key={label}
                        data-nav={label}
                        ref={(node) => {
                            itemRefs.current[label] = node;
                        }}
                        onClick={() => handleNavClick(target)}
                        onPointerEnter={(e) => handlePointerEnter(e, label)}
                        onPointerLeave={(e) => handlePointerLeave(e, label)}
                        className="nav-item relative inline-flex w-max cursor-pointer items-end bg-transparent pb-1 leading-none text-[var(--nav-active)] opacity-0 will-change-[transform,opacity] pointer-events-auto"
                    >
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
