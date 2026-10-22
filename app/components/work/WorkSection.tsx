"use client";

import { useTransitionState } from "next-transition-router";
import ProjectCard from "./ProjectCard";
import StackLabel from "../global/StackLabel";
import { projects } from "../../data/projects";

export default function WorkSection() {
    const { stage } = useTransitionState();
    const isTransitioning = stage !== "none";

    const persistHomeScroll = () => {
        sessionStorage.setItem("home-scroll-y", String(window.scrollY));
    };

    return (
        <section id="work-section" className="w-full px-[3vw] py-24 md:px-[2.5vw] md:py-36">
            <div className="mb-14 flex flex-col items-start gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
                <h2 className="font-display text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-8xl">
                    Recent Works
                </h2>
                <a
                    href="https://github.com/nachodoria"
                    target="_blank"
                    rel="noreferrer"
                    className="dot-after inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2 font-sans text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                >
                    <StackLabel label="See All Projects" speed="fast" />
                </a>
            </div>

            <div className="grid w-full grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        href={`/work/${project.slug}`}
                        disabled={isTransitioning}
                        onNavigate={persistHomeScroll}
                    />
                ))}
            </div>
        </section>
    );
}
