"use client";

import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Link } from "next-transition-router";
import { usePathname } from "next/navigation";
import ScrambleText from "./ScrambleText";

gsap.registerPlugin(ScrollToPlugin);

const LINKEDIN_URL = "https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/";

const navItems = [
    { label: "Home", hash: "top", href: "/" },
    { label: "Work", hash: "#work-section", href: "/#work-section" },
    { label: "About", hash: null, href: "/about" },
];

const PILL_CLASS =
    "dot-after inline-flex items-center rounded-full border border-[var(--ink)]/25 px-4 py-1.5 font-sans text-sm text-[var(--ink)] transition-colors hover:border-[var(--ink)]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

const cubicInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function useTorontoTime() {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "America/Toronto",
        });

        const update = () => setTime(formatter.format(new Date()));
        update();

        const interval = window.setInterval(update, 30_000);
        return () => window.clearInterval(interval);
    }, []);

    return time;
}

export default function Footer() {
    const time = useTorontoTime();
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

    return (
        <footer
            id="contact"
            className="flex w-full flex-col items-center gap-4 border-t border-[var(--border)] px-[6vw] py-6 md:flex-row md:justify-between md:gap-4 md:px-[5vw]"
        >
            <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="dot-after inline-flex items-center rounded-full bg-[var(--ink)] px-5 py-2 font-sans text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--ink)]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
                <ScrambleText text="Get in Touch" />
            </a>

            <nav className="flex flex-wrap items-center justify-center gap-3">
                {navItems.map(({ label, hash, href }) => {
                    if (hash && isHome) {
                        return (
                            <button key={label} type="button" onClick={() => scrollTo(hash)} className={PILL_CLASS}>
                                <ScrambleText text={label} />
                            </button>
                        );
                    }

                    return (
                        <Link key={label} href={href} className={PILL_CLASS}>
                            <ScrambleText text={label} />
                        </Link>
                    );
                })}
            </nav>

            <div className="dot-after flex items-center font-sans text-sm text-[var(--ink)]" suppressHydrationWarning>
                {time ?? "--:--"} Toronto, CA
            </div>
        </footer>
    );
}
