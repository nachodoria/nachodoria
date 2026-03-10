"use client";

import HeroText from "./HeroText";

const links = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/",
        color: "text-[var(--foreground-o)]",
    },
    {
        label: "Github",
        href: "https://github.com/nachodoria",
        color: "text-[var(--foreground-o)]",
    },
    {
        label: "Email",
        href: "mailto:ignaciodoria01@gmail.com",
        color: "text-[var(--foreground-o)]",
    },
];

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] px-[10vw] py-28 md:py-36 flex flex-col justify-center"
        >
            <div className="flex flex-col gap-1 text-[14vw] md:text-[6vw] leading-[0.95] tracking-tight font-sans font-semibold max-w-3xl">
                {links.map(({ label, href, color }) => (
                    <a
                        key={label}
                        href={href}
                        target={label === "Email" ? undefined : "_blank"}
                        rel={label === "Email" ? undefined : "noreferrer"}
                        className={`${color} inline-block w-fit self-start transition-colors duration-200 hover:text-[var(--foreground)] cursor-none`}
                    >
                        {label}
                    </a>
                ))}
            </div>

            <HeroText />
        </section>
    );
}
