"use client";

import Image from "next/image";
import { Link } from "next-transition-router";
import { type ProjectData } from "../../data/projects";
import ProjectHoverCard from "./ProjectHoverCard";
import StackLabel from "../global/StackLabel";

interface ProjectCardProps {
    project: ProjectData;
    href: string;
    disabled: boolean;
    onNavigate: () => void;
}

export default function ProjectCard({
    project,
    href,
    disabled,
    onNavigate,
}: ProjectCardProps) {
    const imageSizes = "(min-width: 1024px) 24vw, (min-width: 768px) 30vw, 90vw";

    return (
        <Link
            href={href}
            scroll={false}
            aria-disabled={disabled}
            aria-label={`Open ${project.title}`}
            className={`project-card group flex w-full flex-col gap-4 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${disabled ? "pointer-events-none" : ""}`}
            onClick={(event) => {
                if (disabled) {
                    event.preventDefault();
                    return;
                }

                onNavigate();
            }}
        >
            <h3 className="project-card-title font-sans text-[1.725rem] font-medium tracking-tight">
                {project.title}
            </h3>

            <div className="flex items-center gap-3">
                <span className="stack-label-trigger dot-after dot-after--accent inline-flex items-center rounded-full border border-[var(--ink)]/25 px-3.5 py-1 font-sans text-sm text-[var(--ink)] transition-colors group-hover:border-[var(--ink)]/50">
                    <StackLabel label="View" speed="fast" />
                </span>
                <span className="font-sans text-sm text-[var(--muted)]">{project.category}</span>
            </div>

            <ProjectHoverCard>
                {project.cardImage ? (
                    <img
                        src={project.cardImage.src}
                        alt={project.imageAlt}
                        width={project.cardImage.width}
                        height={project.cardImage.height}
                        draggable={false}
                        decoding="async"
                        loading="lazy"
                        className="block h-full w-full object-cover object-center"
                    />
                ) : (
                    <Image
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        fill
                        draggable={false}
                        quality={84}
                        sizes={imageSizes}
                        unoptimized={project.imageSrc.endsWith(".svg")}
                        className="object-cover object-center"
                    />
                )}
            </ProjectHoverCard>
        </Link>
    );
}
