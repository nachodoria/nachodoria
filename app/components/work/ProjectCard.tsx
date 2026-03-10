"use client";

import gsap from "gsap";
import { type MouseEvent, useRef } from "react";

export interface WorkProject {
    slug: string;
    title: string;
    languages: string[];
}

interface ProjectCardProps {
    project: WorkProject;
    href: string;
    variant: "wide" | "narrow";
    disabled: boolean;
    onNavigate: (href: string) => void;
    onCursorHover: (isHovering: boolean) => void;
}

export default function ProjectCard({
    project,
    href,
    variant,
    disabled,
    onNavigate,
    onCursorHover,
}: ProjectCardProps) {
    const mediaRef = useRef<HTMLDivElement>(null);
    const isWide = variant === "wide";

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!mediaRef.current) return;

        const bounds = mediaRef.current.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
        const drift = 10;

        gsap.to(mediaRef.current, {
            x: -offsetX * drift,
            y: -offsetY * drift,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
        });
    };

    const handleMouseLeave = () => {
        onCursorHover(false);

        if (!mediaRef.current) return;

        gsap.to(mediaRef.current, {
            x: 0,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
        });
    };

    return (
        <button
            type="button"
            onClick={() => onNavigate(href)}
            disabled={disabled}
            aria-label={`Open ${project.title}`}
            className={`project-card group flex w-full flex-col text-left cursor-none disabled:pointer-events-none ${isWide ? "md:col-span-5" : "md:col-span-3"}`}
        >
            <div className="card-content flex flex-col will-change-transform">
                <div
                    className="page-transition-item page-transition-visual relative h-[28vh] min-h-[220px] overflow-hidden rounded-[2.75rem] shadow-2xl md:h-[34vh]"
                    onMouseEnter={() => onCursorHover(true)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        ref={mediaRef}
                        className="absolute inset-0 w-full overflow-hidden rounded-[2.75rem] transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-[0.82]"
                        style={{ backgroundColor: "currentColor" }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.14))]"></div>
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                        <div className="overflow-hidden">
                            <h3
                                className="page-transition-item page-transition-text text-sm md:text-base font-medium uppercase tracking-[0.28em] text-[var(--background)]"
                            >
                            {project.title}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}
