"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, Observer);

/**
 * GSAP Helper: Horizontal Loop
 * @link https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop
 */
function horizontalLoop(items: any[], config: any) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); }
    }),
        length = items.length,
        startX = items[0].offsetLeft,
        times: number[] = [],
        widths: number[] = [],
        xPercents: number[] = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? (v: any) => v : gsap.utils.snap(config.snap || 1),
        totalWidth: number, curX: number, distanceToStart: number, distanceToLoop: number, item: any, i: number;

    gsap.set(items, {
        xPercent: (i, el) => {
            let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px") as string) / w * 100 + Number(gsap.getProperty(el, "xPercent")));
            return xPercents[i];
        },
        force3D: true // Ensure GPU acceleration for all items
    });

    gsap.set(items, { x: 0 });
    totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * Number(gsap.getProperty(items[length - 1], "scaleX")) + (parseFloat(config.paddingRight) || 0);

    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * Number(gsap.getProperty(item, "scaleX"));
        tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
            .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars: any) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
            vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }

    (tl as any).next = (vars: any) => toIndex(curIndex + 1, vars);
    (tl as any).previous = (vars: any) => toIndex(curIndex - 1, vars);
    (tl as any).current = () => curIndex;
    (tl as any).toIndex = (index: number, vars: any) => toIndex(index, vars);
    (tl as any).times = times;
    tl.progress(1, true).progress(0, true);
    if (config.reversed) {
        (tl as any).vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}

export default function WorkSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const railRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!railRef.current) return;

        const items = gsap.utils.toArray(".marquee-item");

        // Initialize the seamless horizontal loop
        const loop = horizontalLoop(items, {
            repeat: -1,
            speed: 1.5,
            paddingRight: 50, // Gap between items
        });

        const obs = Observer.create({
            target: window,
            type: "wheel,touch",
            onChangeY(self) {
                // Next.js/Browser scroll delta: positive for down, negative for up
                const direction = self.deltaY > 0 ? 1 : -1;

                // 1. Smoothly transition the base direction
                gsap.to(loop, {
                    timeScale: direction,
                    duration: 0.5,
                    overwrite: "auto"
                });

                // 2. Smoothly advance the playhead based on scroll delta
                // Using a duration (e.g. 0.8s) instead of 0 creates a "momentum" follow effect
                // that masks the discrete steps of a mouse wheel and the micro-jitter of a trackpad.
                const scrollFactor = 0.8;
                const pixelsPerSecond = 100;
                const scrollDeltaSeconds = (self.deltaY * scrollFactor) / pixelsPerSecond;

                gsap.to(loop, {
                    totalTime: `+=${scrollDeltaSeconds}`,
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });

        // 1. Grid Reveal Animation (Outer Container) - TONED DOWN
        gsap.utils.toArray(".project-card").forEach((card: any, index: number) => {
            gsap.fromTo(card,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    delay: index * 0.15,
                    ease: "power2.out", // Softer ease as requested
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        toggleActions: "play none none reverse",
                        onEnter: () => ScrollTrigger.refresh()
                    }
                }
            );

            // 2. Parallax Away Animation (Inner Content)
            const content = card.querySelector(".card-content");
            const speeds = [-60, -120, -90, -160, -100];

            gsap.to(content, {
                y: speeds[index % speeds.length],
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top center",
                    end: "bottom top",
                    scrub: 1.5,
                }
            });
        });

        // Global refresh after everything is settled to fix "jumping"
        const refreshId = gsap.delayedCall(1.5, () => ScrollTrigger.refresh());

        return () => {
            loop.kill();
            obs.kill();
            refreshId.kill();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, { scope: sectionRef });

    const projects = [
        {
            slug: "portfolio",
            title: "Personal Portfolio",
            languages: ["NextJS", "GSAP", "Lenis", "Tailwind CSS"]
        },
        {
            slug: "text-animations",
            title: "Text Animations",
            languages: ["NextJS", "Framer Motion", "Observer API"]
        },
        {
            slug: "threejs-worlds",
            title: "Three JS Worlds",
            languages: ["ThreeJS", "Blender"]
        },
        {
            slug: "fridge-finder",
            title: "Fridge Finder",
            languages: ["Dart", "Flutter"]
        }
    ];

    const setCursorHover = (isHovering: boolean) => {
        window.dispatchEvent(new CustomEvent("cursorHover", { detail: { isHovering } }));
    };

    return (
        <section
            id="work-section"
            ref={sectionRef}
            className="w-full min-h-screen bg-[var(--foreground)] text-[var(--background)] flex flex-col items-center justify-start py-20 overflow-hidden"
        >
            {/* Horizontal Marquee Text Wrap */}
            <div className="w-full overflow-hidden select-none mb-32 border-y border-[var(--background-o)] py-10 flex flex-col will-change-transform">
                <div
                    ref={railRef}
                    className="rail flex whitespace-nowrap text-[8vw] font-sans font-bold leading-none tracking-tighter uppercase opacity-90 will-change-transform"
                >
                    {/* Items for the horizontal loop helper */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        <h4 key={i} className="marquee-item px-10 will-change-transform" style={{ force3D: "true" } as any}>
                            Some of my work
                        </h4>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 w-full max-w-7xl px-[5vw] mb-32">
                {projects.map((project, index) => (
                    <Link
                        key={index}
                        href={`/work/${project.slug}`}
                        className="project-card flex flex-col cursor-none"
                    >
                        <div className="card-content flex flex-col gap-6 will-change-transform">
                            {/* Image Placeholder */}
                            <div
                                className="w-full aspect-[16/10] bg-[var(--background)] rounded-[2.5rem] overflow-hidden relative transition-transform duration-700 group-hover:scale-[1.02] shadow-2xl"
                                onMouseEnter={() => setCursorHover(true)}
                                onMouseLeave={() => setCursorHover(false)}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                                    <span className="text-3xl font-medium uppercase tracking-tighter text-black">
                                        {project.title}
                                    </span>
                                </div>
                            </div>

                            {/* Badges & Title */}
                            <div className="flex flex-col gap-3 px-2">
                                <div className="flex flex-wrap gap-3">
                                    {project.languages.map((lang, i) => (
                                        <span key={i} className="text-xs uppercase tracking-widest text-[var(--foreground-text)]/40 font-bold border border-[var(--foreground-text)]/10 px-3 py-1 rounded-full">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-3xl md:text-[3.5vw] font-medium tracking-tighter text-[var(--foreground-text)] leading-none mt-1">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer space */}
            <div className="py-20"></div>
        </section>
    );
}
