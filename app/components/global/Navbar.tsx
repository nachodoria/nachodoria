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
    const [activeItem, setActiveItem] = useState<string>("About");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const navItems = [
        { label: "About", target: "top" },
        { label: "Work", target: "#work-section" },
        { label: "Contact", target: "#contact" },
    ];

    const handleNavClick = (item: string, target: string) => {
        setActiveItem(item);

        if (target === "top") {
            gsap.killTweensOf(window);
            gsap.to(window, {
                duration: 1.15,
                ease: "expo.inOut",
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

        gsap.killTweensOf(window);
        gsap.to(window, {
            duration: 1.15,
            ease: "expo.inOut",
            scrollTo: {
                y: targetEl,
                autoKill: false,
            },
            overwrite: "auto",
        });
    };

    useGSAP(() => {
        if (isReady && container.current) {
            gsap.set(container.current, {
                "--nav-active": "var(--foreground)",
                "--nav-dim": "var(--foreground-o)",
                backgroundColor: "transparent",
            });

            gsap.to(".nav-item", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.2,
                force3D: true
            });

            ScrollTrigger.create({
                trigger: "#work-section",
                start: "top top",
                end: "bottom top",
                onEnter: () => {
                    setActiveItem("Work");
                },
                onEnterBack: () => {
                    setActiveItem("Work");
                },
                onLeave: () => {
                    setActiveItem("Contact");
                },
                onLeaveBack: () => {
                    setActiveItem("About");
                },
            });
        }
    }, [isReady]);

    useGSAP(() => {
        if (!isReady || !container.current) return;

        const focusedItem = hoveredItem ?? activeItem;
        const navItems = gsap.utils.toArray<HTMLElement>(".nav-item");

        gsap.to(navItems, {
            opacity: focusedItem ? 0.45 : 1,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
        });

        if (focusedItem) {
            const focusedEl = container.current.querySelector<HTMLElement>(`.nav-item[data-nav="${focusedItem}"]`);
            if (focusedEl) {
                gsap.to(focusedEl, {
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            }
        }
    }, [isReady, activeItem, hoveredItem]);

    return (
        <nav
            ref={container}
            className="fixed top-0 left-0 w-full flex justify-end items-center h-[12vh] px-[5vw] gap-[4vw] md:gap-10 font-sans font-medium text-[3.5vw] md:text-xl tracking-tight z-[100]"
        >
            {navItems.map(({ label, target }) => {
                const focusedItem = hoveredItem ?? activeItem;
                const isHighlighted = focusedItem === label;

                return (
                    <button
                        type="button"
                        key={label}
                        data-nav={label}
                        onClick={() => handleNavClick(label, target)}
                        onMouseEnter={() => setHoveredItem(label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="nav-item page-transition-nav bg-transparent opacity-0 translate-y-[-20px] transition-colors duration-200 ease-out will-change-[transform,opacity,color] cursor-none"
                        style={{
                            color: isHighlighted ? "var(--nav-active)" : "var(--nav-dim)"
                        } as any}
                    >
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}
