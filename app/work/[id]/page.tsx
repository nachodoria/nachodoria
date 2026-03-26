import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/app/components/transition/Reveal";
import { Title } from "@/app/components/transition/Title";
import ScrollToTop from "@/app/components/transition/ScrollToTop";
import BackLink from "@/app/components/transition/BackLink";
import { projects, projectsBySlug } from "../../data/projects";

const withAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    return projects.map((project) => ({
        id: project.slug,
    }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { id } = await params;
    const project = projectsBySlug[id];

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: project.title,
        description: project.shortDescription,
        openGraph: {
            title: `${project.title} | Ignacio Doria`,
            description: project.shortDescription,
            images: [{ url: project.imageSrc }],
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const project = projectsBySlug[id];

    if (!project) {
        notFound();
    }

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
    } as React.CSSProperties;

    return (
        <main
            className="min-h-[100svh] overflow-x-hidden bg-[var(--background)] px-[5vw] py-8 text-[var(--foreground)] md:py-10"
            style={pageStyle}
        >
            <ScrollToTop />
            <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1520px] flex-col gap-10 lg:min-h-[calc(100svh-5rem)] lg:gap-14">
                <Reveal delay={0.05} distance={14} variant="slide">
                    <BackLink />
                </Reveal>

                <section className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-20">
                    <div className="flex max-w-xl flex-col justify-center gap-7 lg:gap-9">
                        <div className="space-y-3">
                            <Title
                                delay={0.12}
                                className=" text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] sm:text-5xl lg:text-[clamp(3.8rem,5vw,6.4rem)]"
                            >
                                {project.title}
                            </Title>
                        </div>

                        <Reveal delay={0.3} distance={20} variant="fade">
                            <p className="max-w-xl text-[1.08rem] leading-[1.6] text-[var(--foreground)]/88 md:text-[1.22rem]">
                                {project.longDescription}
                            </p>
                        </Reveal>

                        <div className="font-mono flex flex-col gap-2 pt-2 text-[0.95rem] tracking-tight text-[var(--foreground)]/70 md:text-[1.05rem]">
                            <Reveal delay={0.42} distance={10} variant="slide">
                                <p>
                                    <span className="font-semibold text-[var(--foreground)]">Stack: </span>
                                    {project.technologies.join(", ")}
                                </p>
                            </Reveal>
                            <Reveal delay={0.5} distance={10} variant="slide">
                                <p>
                                    <span className="font-semibold text-[var(--foreground)]">Year: </span>
                                    {project.year}
                                </p>
                            </Reveal>
                        </div>

                        {project.linkHref ? (
                            <Reveal delay={0.58} distance={16} variant="fade" className="mt-4">
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
                        delay={0.08}
                        direction="right"
                        variant="clip"
                        imageScale={1.08}
                        className="relative h-[32vh] min-h-[230px] overflow-hidden rounded-[1.8rem] border border-[var(--foreground)]/12 shadow-[0_16px_38px_rgba(0,0,0,0.1)] sm:h-[38vh] lg:h-[54vh] xl:h-[58vh]"
                    >
                        <Image
                            src={project.imageSrc}
                            alt={project.imageAlt}
                            fill
                            draggable={false}
                            priority
                            quality={88}
                            sizes="(min-width: 1536px) 56vw, (min-width: 1280px) 54vw, (min-width: 1024px) 50vw, 88vw"
                            className="object-cover object-center"
                        />
                    </Reveal>
                </section>
            </div>
        </main>
    );
}
