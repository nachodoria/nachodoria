"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface NavbarProps {
    isReady: boolean;
}

export default function Navbar({ isReady }: NavbarProps) {
    const container = useRef<HTMLDivElement>(null);
    const itemsRow = useRef<HTMLDivElement>(null);
    const underline = useRef<HTMLSpanElement>(null);
    const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const underlineReady = useRef(false);
    const underlineXTo = useRef<((value: number) => gsap.core.Tween) | null>(null);
    const underlineWidthTo = useRef<((value: number) => gsap.core.Tween) | null>(null);
    const [activeItem, setActiveItem] = useState<string>("About");
    const navItems = [
        { label: "About", target: "top" },
        { label: "Work", target: "#work-section" },
        { label: "Contact", target: "#contact" },
    ];

    const moveUnderline = (label: string | null, immediate = false) => {
        const underlineElement = underline.current;
        const rowElement = itemsRow.current;

        if (!underlineElement || !rowElement) return;
        if (!underlineReady.current && !immediate) return;

        const targetButton = label ? itemRefs.current[label] : null;
        if (!targetButton) {
            if (immediate) {
                gsap.set(underlineElement, {
                    width: 0,
                    autoAlpha: 0,
                    x: 0,
                });
            } else {
                gsap.to(underlineElement, {
                    autoAlpha: 0,
                    duration: 0.14,
                    ease: "power2.out",
                    overwrite: true,
                });
            }
            return;
        }

        const rowBounds = rowElement.getBoundingClientRect();
        const buttonBounds = targetButton.getBoundingClientRect();
        const nextWidth = buttonBounds.width;
        const nextX = buttonBounds.left - rowBounds.left;

        if (immediate) {
            gsap.set(underlineElement, {
                x: nextX,
                width: nextWidth,
                autoAlpha: 1,
            });
            return;
        }

        gsap.set(underlineElement, {
            autoAlpha: 1,
        });
        underlineXTo.current?.(nextX);
        underlineWidthTo.current?.(nextWidth);
    };

    const handleNavClick = (item: string, target: string) => {
        setActiveItem(item);
        const smoothScroll = window.__portfolioLocomotive;
        
        // A much more polished cubic in-out easing (power3.inOut)
        // Starts smoothly, hits moderate max speed, glides nicely into place.
        const cubicInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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

    useGSAP(() => {
        if (isReady && container.current) {
            const navButtons = container.current.querySelectorAll<HTMLElement>(".nav-item");
            const underlineElement = underline.current;

            gsap.set(container.current, {
                "--nav-active": "var(--foreground)",
                "--nav-underline": "var(--foreground)",
                backgroundColor: "transparent",
            });
            underlineReady.current = false;

            if (underlineElement) {
                gsap.set(underlineElement, {
                    autoAlpha: 0,
                    width: 0,
                    x: 0,
                });

                underlineXTo.current = gsap.quickTo(underlineElement, "x", {
                    duration: 0.2,
                    ease: "power3.out",
                    overwrite: true,
                });
                underlineWidthTo.current = gsap.quickTo(underlineElement, "width", {
                    duration: 0.2,
                    ease: "power3.out",
                    overwrite: true,
                });
            }

            gsap.to(navButtons, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power4.out",
                delay: 0.1,
                force3D: true,
                onComplete: () => {
                    underlineReady.current = true;
                    requestAnimationFrame(() => {
                        moveUnderline(activeItem, true);
                    });
                },
            });

            const sectionTriggers = [
                { label: "About", trigger: "#about" },
                { label: "Work", trigger: "#work-section" },
                { label: "Contact", trigger: "#contact" },
            ].map(({ label, trigger }) => ScrollTrigger.create({
                trigger,
                start: "top center",
                end: "bottom center",
                onToggle: (self) => {
                    if (self.isActive) {
                        setActiveItem(label);
                    }
                },
            }));

            return () => {
                underlineReady.current = false;
                sectionTriggers.forEach((trigger) => trigger.kill());
            };
        }
    }, [isReady]);

    useGSAP(() => {
        if (!isReady) return;

        moveUnderline(activeItem);
    }, [isReady, activeItem]);

    useGSAP(() => {
        if (!isReady) return;

        const handleResize = () => {
            moveUnderline(activeItem, true);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isReady, activeItem]);

    return (
        <nav
            ref={container}
            className="fixed top-0 left-0 z-[100] flex h-16 w-full items-center justify-center gap-5 px-4 font-sans text-sm font-medium tracking-tight sm:text-base md:h-[12vh] md:justify-end md:gap-10 md:px-[5vw] md:text-xl pointer-events-none"
        >
            <div
                ref={itemsRow}
                className="relative flex items-center gap-5 sm:gap-6 md:gap-10 pointer-events-auto"
            >
                {navItems.map(({ label, target }) => (
                    <button
                        type="button"
                        key={label}
                        data-nav={label}
                        ref={(node) => {
                            itemRefs.current[label] = node;
                        }}
                        onClick={() => handleNavClick(label, target)}
                        onPointerEnter={(event) => {
                            if (event.pointerType !== "mouse") return;
                            moveUnderline(label);
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType !== "mouse") return;
                            moveUnderline(activeItem);
                        }}
                        className="nav-item relative inline-flex w-max items-end bg-transparent pb-1 leading-none text-[var(--nav-active)] opacity-0 translate-y-[-20px] will-change-[transform,opacity] pointer-events-auto"
                    >
                        <span>{label}</span>
                    </button>
                ))}

                <span
                    ref={underline}
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-1 left-0 h-0.5 bg-[var(--nav-underline)] opacity-0"
                />
            </div>
        </nav>
    );
}
