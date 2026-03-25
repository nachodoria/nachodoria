"use client";

import { useEffect, useState } from "react";
import HeroText from "./HeroText";

const links = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/",
        external: true,
        color: "text-[var(--foreground-o)]",
    },
    {
        label: "Github",
        href: "https://github.com/nachodoria",
        external: true,
        color: "text-[var(--foreground-o)]",
    },
];

const EMAIL_ADDRESS = "ignaciodoria01@gmail.com";

function CopyIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="9" y="9" width="10" height="10" rx="2" />
            <path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.5 9.2 16.7 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ContactSection() {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;

        const timeoutId = window.setTimeout(() => {
            setCopied(false);
        }, 1800);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [copied]);

    const handleCopyEmail = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;

        try {
            await navigator.clipboard.writeText(EMAIL_ADDRESS);
            setCopied(true);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = EMAIL_ADDRESS;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
        }

        button.blur();
    };

    return (
        <section
            id="contact"
            className="flex min-h-[100svh] w-full flex-col justify-center bg-[var(--background)] px-[6vw] py-20 text-[var(--foreground)] md:px-[10vw] md:py-36"
        >
            <div className="max-w-3xl flex flex-col items-start font-sans text-[18vw] font-semibold leading-[0.95] tracking-tight sm:text-[14vw] md:text-[6vw]">
                {links.map(({ label, href, color, external }) => (
                    <a
                        key={label}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className={`${color} contact-link inline-flex w-max leading-none transition-colors duration-200 hover:text-[var(--foreground)]`}
                    >
                        {label}
                    </a>
                ))}

                <div className="group relative inline-flex w-max">
                    <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="contact-link inline-flex w-max leading-none text-[var(--foreground-o)] transition-colors duration-200 hover:text-[var(--foreground)] focus:text-[var(--foreground)] focus:outline-none"
                        aria-label={copied ? "Email copied to clipboard" : `Copy email ${EMAIL_ADDRESS} to clipboard`}
                    >
                        Email
                    </button>

                    <div className="pointer-events-none invisible absolute left-0 top-full z-10 mt-3 inline-flex translate-y-1 items-center gap-2 rounded-full border border-[var(--foreground)]/12 bg-[var(--foreground)] px-3 py-2 text-sm font-medium leading-none tracking-normal text-[var(--background)] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:left-full md:top-1/2 md:mt-0 md:ml-3 md:-translate-y-1/2 md:translate-y-0">
                        <span className="whitespace-nowrap">{EMAIL_ADDRESS}</span>
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--background)]/10 ${copied ? "text-[var(--highlight)]" : ""}`}>
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </span>
                    </div>
                </div>
            </div>

            <HeroText />
        </section>
    );
}
