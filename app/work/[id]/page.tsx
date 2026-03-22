"use client";

import { CSSProperties, useLayoutEffect } from "react";
import Image from "next/image";
import { Link } from "next-transition-router";
import { useParams } from "next/navigation";
import { Reveal } from "@/app/components/transition/Reveal";
import { Title } from "@/app/components/transition/Title";
import { projectsBySlug } from "../../data/projects";

const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

export default function ProjectPage() {
    const { id } = useParams();
    const project = projectsBySlug[id as string];
    const detailImageSrc = project?.detailImageSrc ?? project?.imageSrc ?? "";
    const pageStyle = {
        "--background": "#ffffeb",
        "--background-o": withAlpha("#ffffeb", "88"),
        "--foreground": "#112712",
        "--foreground-o": withAlpha("#112712", "bf"),
        "--foreground-secondary": "#5ea85d",
        "--foreground-tertiary": "#3f7d3e",
        "--hero-title-color": "#112712",
        "--hero-title-dim": withAlpha("#112712", "bf"),
        "--highlight": "#5ea85d",
    } as CSSProperties;

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <main
            className="min-h-[100svh] overflow-x-hidden bg-[var(--background)] px-[5vw] py-8 text-[var(--foreground)] md:py-10"
            style={pageStyle}
        >
            <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1400px] flex-col gap-10 lg:min-h-[calc(100svh-5rem)] lg:gap-14">
                <Reveal delay={0} distance={18}>
                    <Link
                        href="/"
                        scroll={false}
                        className="inline-flex w-fit items-center gap-2 leading-none text-sm font-semibold uppercase tracking-[0.16em] opacity-70 transition-opacity duration-200 hover:opacity-100 md:text-base"
                    >
                        Back
                    </Link>
                </Reveal>

                <section className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16">
                    <div className="flex max-w-xl flex-col justify-center gap-7 lg:gap-9">
                        <div className="space-y-3">
                            <Title
                                delay={0.05}
                                className="font-mono text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] sm:text-5xl lg:text-[clamp(3.8rem,5vw,6.4rem)]"
                            >
                                {project.title}
                            </Title>
                        </div>

                        <Reveal delay={0.1} distance={24}>
                            <p className="max-w-xl text-[1.08rem] leading-[1.6] text-[var(--foreground)]/88 md:text-[1.22rem]">
                                {project.longDescription}
                            </p>
                        </Reveal>

                        <div className="font-mono flex flex-col gap-2 pt-2 text-[0.95rem] tracking-tight text-[var(--foreground)]/70 md:text-[1.05rem]">
                            <Reveal delay={0.16} distance={12}>
                                <p>
                                    <span className="font-semibold text-[var(--foreground)]">Stack: </span>
                                    {project.technologies.join(", ")}
                                </p>
                            </Reveal>
                            <Reveal delay={0.22} distance={12}>
                                <p>
                                    <span className="font-semibold text-[var(--foreground)]">Year: </span>
                                    {project.year}
                                </p>
                            </Reveal>
                        </div>

                        {project.linkHref ? (
                            <Reveal delay={0.28} distance={18} className="mt-4">
                                <a
                                    href={project.linkHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="button--anthe inline-flex w-fit items-center rounded-full px-8 py-3.5 leading-none text-[0.85rem] font-semibold tracking-wide md:px-10 md:py-4 md:text-[0.95rem]"
                                >
                                    <span>{project.linkLabel ?? "View Project"}</span>
                                </a>
                            </Reveal>
                        ) : null}
                    </div>

                    <Reveal
                        delay={0.03}
                        direction="right"
                        distance={80}
                        imageScale={1.08}
                        className="relative h-[32vh] min-h-[230px] overflow-hidden rounded-[1.8rem] border border-[var(--foreground)]/12 shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:h-[38vh] lg:h-[50vh]"
                    >
                        <Image
                            src={detailImageSrc}
                            alt={project.imageAlt}
                            fill
                            priority
                            quality={88}
                            sizes="(min-width: 1280px) 46vw, (min-width: 1024px) 44vw, 88vw"
                            className="object-cover object-center"
                        />
                    </Reveal>
                </section>
            </div>
        </main>
    );
}
