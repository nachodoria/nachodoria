"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import CustomCursor from "@/app/components/global/CustomCursor";
import { useParams, useRouter } from "next/navigation";

const projectData: Record<string, any> = {
    "portfolio": {
        title: "Personal Portfolio",
        description: "A high-performance personal portfolio featuring advanced GSAP animations, a truly infinite marquee, and perfectly fluid smooth scrolling.",
        technologies: "NextJS, GSAP, Lenis, Tailwind CSS",
        year: "2026"
    },
    "text-animations": {
        title: "Text Animations",
        description: "Built a library of reusable text animations to inspire developers.",
        technologies: "NextJS, Framer Motion, Observer API",
        year: "2023"
    },
    "threejs-worlds": {
        title: "Three JS Worlds",
        description: "A collection of interactive ThreeJS experiments and 3D web scenes built to explore graphics, animation, and real-time rendering on the web. This project showcases multiple ThreeJS creations including Golden Portal and Galaxy Generator.",
        technologies: "ThreeJS, Blender",
        year: "2024"
    },
    "othello-board": {
        title: "Othello Board",
        description: "Implementation of the classic Othello (Reversi) board game. Players can play against another player or against an AI while the system validates moves and flips discs automatically.",
        technologies: "Java, Object-Oriented Programming",
        year: "2023"
    },
    "fridge-finder": {
        title: "Fridge Finder",
        description: "A mobile application designed to help users organize fridge inventory, track expiration dates, and manage food items efficiently.",
        technologies: "Dart, Flutter",
        year: "2024"
    }
};

export default function ProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const project = projectData[id as string];
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLeaving, setIsLeaving] = useState(false);

    useLayoutEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        html.style.overflow = "";
        body.style.overflow = "";
        body.style.pointerEvents = "";
        window.scrollTo(0, 0);
    }, []);

    useGSAP(() => {
        const entering = gsap.utils.toArray<HTMLElement>(".project-enter");

        gsap.to(entering, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
        });
    }, { scope: containerRef });

    if (!project) return <div>Project not found</div>;

    const handleBack = () => {
        if (isLeaving) return;

        setIsLeaving(true);

        const html = document.documentElement;
        const body = document.body;
        const leaving = gsap.utils.toArray<HTMLElement>(".project-enter");

        window.dispatchEvent(new CustomEvent("portfolio-scroll-stop"));
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.pointerEvents = "none";

        gsap.timeline({
            defaults: {
                overwrite: "auto",
            },
            onComplete: () => {
                router.push("/", { scroll: false });
            },
        })
            .to(leaving, {
                y: -20,
                opacity: 0,
                duration: 0.5,
                ease: "power3.out",
            }, 0)
            .to({}, {
                duration: 0.18,
            });
    };

    return (
        <main ref={containerRef} className="bg-[var(--background)] min-h-screen w-full overflow-x-hidden text-[var(--foreground)] px-[5vw] py-16 flex flex-col gap-16">
            <CustomCursor />

            {/* Back Button */}
            <div className="overflow-hidden">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={isLeaving}
                    className="project-enter fixed top-8 left-10 bg-transparent text-xl font-medium uppercase tracking-tight z-50 opacity-70 hover:opacity-100 transition-opacity translate-y-[30px] cursor-none disabled:pointer-events-none"
                >
                    Back
                </button>
            </div>

            {/* Project Title */}
            <div className="overflow-hidden">
                <h1 className="project-enter text-4xl md:text-5xl lg:text-[5.6vw] font-medium leading-[0.92] tracking-tight uppercase text-center opacity-0 translate-y-[60px]">
                    {project.title}
                </h1>
            </div>

            {/* Central Image Placeholder */}
            <div className="overflow-hidden rounded-[2.5rem]">
                <div className="project-enter w-full max-w-[62rem] mx-auto aspect-[16/8] bg-[var(--foreground)] rounded-[2.5rem] overflow-hidden relative shadow-2xl opacity-0 translate-y-[60px]">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="text-[5vw] font-bold uppercase tracking-tighter text-[var(--background)]">
                            {project.title}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Section: Overview Left, Info Right */}
            <div className="overflow-hidden">
                <div className="project-enter w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mt-10 opacity-0 translate-y-[60px]">
                    {/* Down Left: Overview */}
                    <div className="flex-1">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase leading-none">
                            Overview
                        </h2>
                    </div>

                    {/* Down Right: Description & Tech */}
                    <div className="flex-[2] flex flex-col items-end text-right gap-8">
                        <p className="text-lg md:text-xl font-normal leading-tight opacity-90 max-w-xl">
                            {project.description}
                        </p>

                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Technologies</span>
                            <p className="text-sm md:text-base font-bold tracking-tight">
                                {project.technologies}
                            </p>
                            <div className="mt-2 h-[1px] w-20 bg-[var(--foreground)] opacity-20"></div>
                            <p className="text-xs opacity-40 font-bold mt-1">{project.year}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
