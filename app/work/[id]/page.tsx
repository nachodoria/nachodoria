"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Link from "next/link";
import CustomCursor from "@/app/components/global/CustomCursor";
import SmoothScroll from "@/app/components/global/SmoothScroll";
import { useParams } from "next/navigation";

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
    const project = projectData[id as string];
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".reveal", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    if (!project) return <div>Project not found</div>;

    const setCursorHover = (isHovering: boolean) => {
        window.dispatchEvent(new CustomEvent("cursorHover", { detail: { isHovering } }));
    };

    return (
        <main ref={containerRef} className="bg-[var(--background)] h-screen w-full text-[var(--foreground)] px-[5vw] py-16 flex flex-col justify-between overflow-hidden">
            <CustomCursor />

            {/* Back Button */}
            <Link href="/" className="fixed top-8 left-10 text-xl font-medium uppercase tracking-tight z-50 hover:opacity-50 transition-opacity">
                Back
            </Link>

            {/* Project Title - Smaller as requested */}
            <h1 className="reveal text-4xl md:text-6xl font-bold leading-none tracking-tighter uppercase text-center">
                {project.title}
            </h1>

            {/* Central Image Placeholder */}
            <div className="reveal w-full max-w-6xl mx-auto aspect-[16/8] bg-[var(--foreground)] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-[5vw] font-bold uppercase tracking-tighter text-[var(--background)]">
                        {project.title}
                    </span>
                </div>
            </div>

            {/* Footer Section: Overview Left, Info Right */}
            <div className="reveal w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mt-10">
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
        </main>
    );
}
