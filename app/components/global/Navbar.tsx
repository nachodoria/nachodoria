"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    isReady: boolean;
}

export default function Navbar({ isReady }: NavbarProps) {
    const container = useRef<HTMLDivElement>(null);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useGSAP(() => {
        if (isReady && container.current) {
            // Set initial color state
            gsap.set(container.current, {
                "--nav-active": "var(--foreground)",
                "--nav-dim": "var(--foreground-o)",
            });

            // Entrance animation
            gsap.to(".nav-item", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.2,
                force3D: true
            });

            // Synchronized color inversion on scroll
            const tl = gsap.timeline({ paused: true });
            tl.to(container.current, {
                backgroundColor: "var(--foreground)",
                "--nav-active": "var(--background)",
                "--nav-dim": "var(--background-o)",
                duration: 0.6,
                ease: "power2.inOut",
                force3D: true
            });

            ScrollTrigger.create({
                trigger: "#work-section",
                start: "top 12%", // Matches the h-[12vh] of your navbar
                onEnter: () => {
                    tl.play();
                    setActiveItem("Work");
                },
                onLeaveBack: () => {
                    tl.reverse();
                    setActiveItem(null);
                },
            });
        }
    }, [isReady]);

    return (
        <nav
            ref={container}
            className="fixed top-0 left-0 w-full flex justify-end items-center h-[12vh] px-[5vw] gap-[4vw] md:gap-10 font-sans font-medium text-[3.5vw] md:text-xl tracking-tight z-[100]"
        >
            {["Work", "About", "Contact"].map((item) => {
                const isHighlighted = hoveredItem ? hoveredItem === item : activeItem === item;

                return (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setActiveItem(item)}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="nav-item opacity-0 translate-y-[-10px] transition-colors duration-300 cursor-none will-change-[transform,opacity,color]"
                        style={{
                            color: isHighlighted ? "var(--nav-active)" : "var(--nav-dim)"
                        } as any}
                    >
                        {item}
                    </a>
                );
            })}
        </nav>
    );
}
