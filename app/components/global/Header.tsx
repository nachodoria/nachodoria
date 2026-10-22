"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Link } from "next-transition-router";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import StackLabel from "./StackLabel";

gsap.registerPlugin(ScrollToPlugin);

const EMAIL_ADDRESS = "ignaciodoria01@gmail.com";

const navItems = [
    { label: "Home", hash: "top", href: "/" },
    { label: "Work", hash: "#work-section", href: "/#work-section" },
    { label: "About", hash: null, href: "/about" },
];

const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/" },
    { label: "GitHub", href: "https://github.com/nachodoria" },
];

const cubicInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Header() {
    const drawerRef = useRef<HTMLDivElement>(null);
    const scrimRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    const scrollTo = useCallback((target: string) => {
        const lenis = window.__lenis;

        if (target === "top") {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2, lerp: 0.05, easing: cubicInOut, force: true });
                return;
            }
            gsap.to(window, { duration: 1.2, ease: "power3.inOut", scrollTo: { y: 0, autoKill: false }, overwrite: "auto" });
            return;
        }

        const targetEl = document.querySelector(target);
        if (!targetEl) return;

        if (lenis) {
            lenis.scrollTo(targetEl as HTMLElement, { duration: 1.2, lerp: 0.05, easing: cubicInOut, force: true });
            return;
        }
        gsap.to(window, { duration: 1.2, ease: "power3.inOut", scrollTo: { y: targetEl, autoKill: false }, overwrite: "auto" });
    }, []);

    const handleNavClick = (target: string) => {
        setIsOpen(false);
        window.setTimeout(() => scrollTo(target), 320);
    };

    useGSAP(() => {
        if (!drawerRef.current || !scrimRef.current) return;

        const items = drawerRef.current.querySelectorAll<HTMLElement>(".drawer-item");

        if (isOpen) {
            document.body.style.overflow = "hidden";
            gsap.set(scrimRef.current, { pointerEvents: "auto" });
            gsap.to(scrimRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(drawerRef.current, { x: "0%", duration: 0.55, ease: "power3.out" });
            gsap.fromTo(
                items,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: 0.18, ease: "power3.out" }
            );
        } else {
            document.body.style.overflow = "";
            gsap.to(scrimRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(scrimRef.current!, { pointerEvents: "none" });
                },
            });
            gsap.to(drawerRef.current, { x: "100%", duration: 0.45, ease: "power3.in" });
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 z-[100] flex h-16 w-full items-center justify-between px-[6vw] md:h-20 md:px-[5vw]">
                {isHome ? (
                    <button
                        type="button"
                        onClick={() => handleNavClick("top")}
                        className="invisible rounded font-sans text-sm font-semibold tracking-tight text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:text-base"
                    >
                        Ignacio Doria
                    </button>
                ) : (
                    <Link
                        href="/"
                        className="invisible rounded font-sans text-sm font-semibold tracking-tight text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:text-base"
                    >
                        Ignacio Doria
                    </Link>
                )}

                <button
                    type="button"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((open) => !open)}
                    className="relative flex h-6 w-7 flex-col items-end justify-center gap-[5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                >
                    <span
                        className="block h-[2px] bg-[var(--ink)] transition-all duration-300"
                        style={{ width: "100%", transform: isOpen ? "translateY(3.5px) rotate(45deg)" : "none" }}
                    />
                    <span
                        className="block h-[2px] bg-[var(--ink)] transition-all duration-300"
                        style={{ width: isOpen ? "100%" : "70%", transform: isOpen ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
                    />
                </button>
            </div>

            <div
                ref={scrimRef}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[110] bg-[var(--ink)]/35 opacity-0"
                style={{ pointerEvents: "none" }}
                aria-hidden="true"
            />

            <div
                ref={drawerRef}
                className="fixed right-0 top-0 z-[120] flex h-full w-[88vw] max-w-[420px] translate-x-full flex-col justify-between bg-[var(--panel)] px-9 py-10 shadow-[-24px_0_60px_rgba(0,0,0,0.25)] md:px-12"
                aria-hidden={!isOpen}
            >
                <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold tracking-tight text-[var(--panel-foreground)]">Menu</span>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setIsOpen(false)}
                        className="relative h-6 w-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--panel-foreground)]"
                    >
                        <span className="absolute left-0 top-1/2 block h-[2px] w-6 -translate-y-1/2 rotate-45 bg-[var(--panel-foreground)]" />
                        <span className="absolute left-0 top-1/2 block h-[2px] w-6 -translate-y-1/2 -rotate-45 bg-[var(--panel-foreground)]" />
                    </button>
                </div>

                <nav className="flex flex-col gap-3">
                    {navItems.map(({ label, hash, href }) => {
                        const className =
                            "drawer-item w-fit text-left font-display text-5xl uppercase tracking-tight text-[var(--panel-foreground)] opacity-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--panel-foreground)] md:text-6xl";

                        if (hash && isHome) {
                            return (
                                <button key={label} type="button" onClick={() => handleNavClick(hash)} className={className}>
                                    <StackLabel label={label} />
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={className}
                            >
                                <StackLabel label={label} />
                            </Link>
                        );
                    })}
                </nav>

                <div className="drawer-item flex flex-col gap-5 opacity-0">
                    <a
                        href={`mailto:${EMAIL_ADDRESS}`}
                        className="inline-flex w-fit items-center rounded-full border border-[var(--panel-border)] px-5 py-2.5 font-sans text-sm text-[var(--panel-foreground)] transition-colors hover:border-[var(--panel-foreground)]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--panel-foreground)]"
                    >
                        {EMAIL_ADDRESS}
                    </a>
                    <div className="flex items-center gap-5">
                        {socials.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="font-sans text-sm text-[var(--panel-muted)] transition-colors hover:text-[var(--panel-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--panel-foreground)]"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
