import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "next-transition-router";
import IntroGate from "@/app/components/transition/IntroGate";
import BackToTopButton from "@/app/components/transition/BackToTopButton";
import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
import StackLabel from "@/app/components/global/StackLabel";
import ScrambleText from "@/app/components/global/ScrambleText";
import HackerText from "@/app/components/global/HackerText";
import { projects, projectsBySlug } from "../../data/projects";

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
            images: [{ url: project.detailImageSrc || project.imageSrc }],
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const project = projectsBySlug[id];

    if (!project) {
        notFound();
    }

    const currentIndex = projects.findIndex((p) => p.slug === project.slug);
    const nextProject = projects[(currentIndex + 1) % projects.length];
    const hasSecondImage = Boolean(project.detailImageSrc) && project.detailImageSrc !== project.imageSrc;

    return (
        <main className="flex min-h-[100svh] flex-col overflow-x-hidden bg-[var(--paper)] px-[5vw] py-8 text-[var(--ink)] md:py-10">
            <Header />
            <IntroGate className="mx-auto mt-16 flex w-full max-w-[1520px] flex-col gap-10 lg:gap-14">
                <Link
                    href="/"
                    scroll={false}
                    className="dot-after inline-flex w-fit items-center rounded-full border border-[var(--ink)]/25 px-4 py-1.5 font-sans text-sm text-[var(--ink)] transition-colors hover:border-[var(--ink)]/50"
                >
                    <ScrambleText text="Home" />
                </Link>

                <section className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:items-start lg:gap-16">
                    <div className="flex flex-col gap-7 lg:gap-9">
                        <h1 className="intro-title font-display text-4xl uppercase leading-[0.9] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[clamp(3.4rem,4.6vw,5.8rem)]">
                            {project.title}
                        </h1>

                        {project.linkHref ? (
                            <a
                                href={project.linkHref}
                                target="_blank"
                                rel="noreferrer"
                                className="dot-after inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-8 py-3.5 leading-none text-[0.85rem] font-semibold tracking-wide text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] md:px-10 md:py-4 md:text-[0.95rem]"
                            >
                                <HackerText text={project.linkLabel ?? "View Project"} />
                            </a>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="intro-meta grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <span className="font-sans text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                                    Year
                                </span>
                                <span className="font-sans text-base text-[var(--ink)] md:text-lg">
                                    {project.year}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="font-sans text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                                    Stack
                                </span>
                                <span className="font-sans text-base text-[var(--ink)] md:text-lg">
                                    {project.technologies.join(", ")}
                                </span>
                            </div>
                        </div>

                        <p className="max-w-prose text-[1rem] leading-[1.6] text-[var(--ink)]/85 md:text-[1.1rem]">
                            {project.longDescription}
                        </p>
                    </div>
                </section>

                {project.hideHeroImage ? null : (
                    <div className={`grid gap-6 ${hasSecondImage ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[var(--ink)]/12 shadow-[0_16px_38px_rgba(0,0,0,0.1)]">
                            <Image
                                src={project.imageSrc}
                                alt={project.imageAlt}
                                fill
                                draggable={false}
                                priority
                                quality={88}
                                unoptimized={project.imageSrc.endsWith(".svg")}
                                sizes={hasSecondImage ? "(min-width: 640px) 50vw, 100vw" : "100vw"}
                                className="intro-hero object-cover object-center"
                            />
                        </div>
                        {hasSecondImage ? (
                            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[var(--ink)]/12 shadow-[0_16px_38px_rgba(0,0,0,0.1)]">
                                <Image
                                    src={project.detailImageSrc as string}
                                    alt={project.imageAlt}
                                    fill
                                    draggable={false}
                                    quality={88}
                                    unoptimized={(project.detailImageSrc as string).endsWith(".svg")}
                                    sizes="(min-width: 640px) 50vw, 100vw"
                                    className="intro-hero object-cover object-center"
                                />
                            </div>
                        ) : null}
                    </div>
                )}

                <div className="intro-body flex flex-col gap-10 lg:gap-14">
                    {project.gallery && project.gallery.length > 0 ? (
                        <div className="flex flex-col gap-[clamp(120px,15vh,240px)]">
                            {project.gallery.map((image, index) => {
                                const isFirstPageImage = project.hideHeroImage && index === 0;

                                return (
                                    <div
                                        key={image.src}
                                        className="mx-auto w-full overflow-hidden rounded-[28px]"
                                        style={{ maxWidth: image.maxWidth ?? 1400 }}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            width={image.width}
                                            height={image.height}
                                            decoding="async"
                                            loading={isFirstPageImage ? "eager" : "lazy"}
                                            fetchPriority={isFirstPageImage ? "high" : undefined}
                                            draggable={false}
                                            className="block h-auto w-full"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-4">
                        <BackToTopButton />
                        <Link
                            href={`/work/${nextProject.slug}`}
                            scroll={false}
                            className="dot-after inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-5 py-2 font-sans text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                        >
                            <StackLabel label="Next Project" speed="fast" />
                        </Link>
                    </div>
                </div>
            </IntroGate>

            <div className="-mx-[5vw] mt-10">
                <Footer />
            </div>
        </main>
    );
}
