"use client";

import Image from "next/image";
import { Link } from "next-transition-router";
import { useState } from "react";
import { projectThemesBySlug, type ProjectData } from "../../data/projects";
import ProjectHoverCard from "./ProjectHoverCard";

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
    const [isHovered, setIsHovered] = useState(false);
    const imageSizes = "(min-width: 1024px) 36vw, (min-width: 768px) 40vw, 90vw";
    const panelColor = projectThemesBySlug[project.slug]?.panelColor ?? "var(--foreground)";
    const handleCardHoverStart = () => {
        setIsHovered(true);
    };
    const handleCardHoverEnd = () => {
        setIsHovered(false);
    };

    return (
        <Link
            href={href}
            scroll={false}
            aria-disabled={disabled}
            aria-label={`Open ${project.title}`}
            className={`project-card group flex w-full flex-col pb-8 md:pb-12 ${disabled ? "pointer-events-none" : ""}`}
            onClick={(event) => {
                if (disabled) {
                    event.preventDefault();
                    return;
                }

                onNavigate();
            }}
            onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                if (!isHovered) handleCardHoverStart();
            }}
            onPointerLeave={(event) => {
                if (event.pointerType !== "mouse") return;
                handleCardHoverEnd();
            }}
            onFocus={handleCardHoverStart}
            onBlur={handleCardHoverEnd}
        >
            {/* Top Row: Title & Year/Tech */}
            <div className="flex w-full items-start justify-between mb-4 md:mb-6">
                <h3
                    className="project-card-title font-mono text-[1.4rem] font-medium tracking-tight leading-none md:text-[2rem]"
                    style={{
                        color: "var(--foreground, #343534)",
                        opacity: isHovered ? 1 : 0.9,
                        transition: "opacity 0.3s ease"
                    }}
                >
                    {project.title}
                </h3>

                <div className="flex flex-col items-end gap-2.5">
                    <span className="font-mono text-[0.95rem] font-normal leading-none md:text-[1.1rem]">
                        {project.year}
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="font-mono rounded-xl border border-[var(--foreground)]/40 px-3 py-1 md:py-1.5 text-[0.7rem] font-normal tracking-wide md:text-[0.75rem]"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Image & Description */}
            <div className="flex flex-col w-full justify-between gap-6 md:flex-row md:items-end md:gap-10">
                <div className="w-full md:w-[60%] lg:w-[58%]">
                    <ProjectHoverCard panelColor={panelColor}>
                        <Image
                            src={project.imageSrc}
                            alt={project.imageAlt}
                            fill
                            draggable={false}
                            quality={84}
                            sizes={imageSizes}
                            className="object-cover object-center"
                        />
                    </ProjectHoverCard>
                </div>

                <div className="w-full md:w-[36%] flex justify-start">
                    <p className="text-left text-[1rem] font-normal leading-[1.6] text-[var(--foreground)]/90 md:text-[1.1rem] md:pb-2">
                        {project.shortDescription}
                    </p>
                </div>
            </div>
        </Link>
    );
}
