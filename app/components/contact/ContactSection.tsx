"use client";

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
    {
        label: "Email",
        href: "mailto:ignaciodoria01@gmail.com",
        external: false,
        color: "text-[var(--foreground-o)]",
    },
];
export default function ContactSection() {
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
            </div>

            <HeroText />
        </section>
    );
}
