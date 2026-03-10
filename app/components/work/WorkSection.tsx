"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import { useRef } from "react";
import ProjectCard, { WorkProject } from "./ProjectCard";
import { usePageTransition } from "../../hooks/usePageTransition";

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
        force3D: true
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

    const setCursorHover = (isHovering: boolean) => {
        window.dispatchEvent(new CustomEvent("cursorHover", { detail: { isHovering } }));
    };

    const persistHomeScroll = () => {
        sessionStorage.setItem("home-scroll-y", String(window.scrollY));
    };

    const { isTransitioning, transitionTo } = usePageTransition({
        scopeRef: sectionRef,
        onBeforeNavigate: persistHomeScroll,
    });

    useGSAP(() => {
        if (!railRef.current || !sectionRef.current) return;

        const items = gsap.utils.toArray(".marquee-item");

        // Initialize the seamless horizontal loop
        const loop = horizontalLoop(items, {
            repeat: -1,
            speed: 1.5,
            paddingRight: 50,
        });

        const obs = Observer.create({
            target: window,
            type: "wheel,touch",
            onChangeY(self) {
                const direction = self.deltaY > 0 ? 1 : -1;
                gsap.to(loop, {
                    timeScale: direction,
                    duration: 0.5,
                    overwrite: "auto"
                });
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

        // 1. Grid Reveal Animation
        const cards = gsap.utils.toArray(".project-card");
        cards.forEach((card: any, index: number) => {
            gsap.fromTo(card,
                { y: 56, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.35,
                    delay: index * 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 112%",
                        toggleActions: "play none none reverse",
                    }
                }
            );

            // 2. Parallax
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

        return () => {
            if (loop) loop.kill();
            if (obs) obs.kill();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, { scope: sectionRef });

    const projects: WorkProject[] = [
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

    return (
        <section
            id="work-section"
            ref={sectionRef}
            className="w-full min-h-screen flex flex-col items-center justify-start py-40 overflow-hidden"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
        >
            <div
                ref={railRef}
                className="rail page-transition-item page-transition-text flex whitespace-nowrap text-[8vw] font-sans font-bold leading-none tracking-tighter uppercase opacity-90 mb-32 py-10"
            >
                {Array.from({ length: 6 }).map((_, i) => (
                    <h4 key={i} className="marquee-item px-10">
                        Some of my work
                    </h4>
                ))}
            </div>

            <div className="grid w-full px-[5vw] mb-32 grid-cols-1 gap-8 md:w-[74vw] md:max-w-none md:px-0 md:grid-cols-8 md:gap-10">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        href={`/work/${project.slug}`}
                        variant={index === 0 || index === projects.length - 1 ? "wide" : "narrow"}
                        disabled={isTransitioning}
                        onNavigate={transitionTo}
                        onCursorHover={setCursorHover}
                    />
                ))}
            </div>
            <div className="py-20"></div>
        </section>
    );
}
