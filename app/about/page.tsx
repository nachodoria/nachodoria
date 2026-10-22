import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
import { workExperience } from "@/app/data/projects";

export const metadata: Metadata = {
    title: "About",
};

const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/" },
    { label: "GitHub", href: "https://github.com/nachodoria" },
];

export default function AboutPage() {
    return (
        <main className="flex min-h-[100svh] flex-col bg-[var(--paper)] text-[var(--ink)]">
            <Header />

            {/* Intro row */}
            <section className="flex w-full flex-col gap-8 px-[6vw] pt-32 pb-16 md:flex-row md:items-center md:gap-10 md:px-[5vw] md:pb-24">
                <span className="font-sans text-sm text-[var(--muted)] md:w-[160px] md:flex-shrink-0">
                    2005 — Present
                </span>

                <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden rounded-xl sm:h-44 sm:w-44 md:h-56 md:w-56">
                    <Image
                        src="/projects/about/myself.jpg"
                        alt="Ignacio Doria"
                        fill
                        draggable={false}
                        priority
                        quality={88}
                        sizes="(min-width: 768px) 224px, (min-width: 640px) 176px, 144px"
                        className="object-cover object-center"
                    />
                </div>

                <p className="max-w-2xl text-sm leading-[1.5] text-[var(--ink)] md:text-base">
                    I am a Computer Science student currently working as a Developer Intern at the Government of Ontario. Developer by day, creative at night.
                </p>

                <nav className="flex items-center gap-5 md:ml-auto">
                    {socials.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="font-sans text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </section>

            {/* Experiences */}
            <section className="w-full px-[6vw] pb-24 md:px-[5vw] md:pb-36">
                <h2 className="font-display text-4xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl">
                    Experiences
                </h2>

                <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:max-w-sm md:mt-14">
                    {workExperience.map((job) => (
                        <div
                            key={job.slug}
                            className="flex flex-col gap-6 rounded-xl border border-[var(--border)] px-6 py-6"
                        >
                            <span className="font-sans text-sm text-[var(--muted)]">{job.period}</span>
                            <span className="font-sans text-2xl font-medium text-[var(--ink)]">
                                {job.role}
                            </span>
                            <span className="font-sans text-sm text-[var(--muted)]">{job.company}</span>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
