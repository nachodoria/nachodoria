"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/all";
import { useRef } from "react";
import { useTransitionState } from "next-transition-router";
import ProjectCard from "./ProjectCard";
import { projects } from "../../data/projects";

gsap.registerPlugin(ScrollTrigger, Observer);

interface HorizontalLoopConfig {
    repeat?: number;
    paused?: boolean;
    speed?: number;
    snap?: number | false;
    paddingRight?: number | string;
    reversed?: boolean;
}

type HorizontalLoopTimeline = gsap.core.Timeline & {
    current: () => number;
    next: (vars?: gsap.TweenVars) => gsap.core.Tween;
    previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
    toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
    times: number[];
};

/**
 * GSAP Helper: Horizontal Loop
 */
function horizontalLoop(items: HTMLElement[] | string, config: HorizontalLoopConfig = {}) {
    const elements = gsap.utils.toArray<HTMLElement>(items);
    const tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => { tl.totalTime(tl.rawTime() + tl.duration() * 100); }
    }) as HorizontalLoopTimeline;
    const length = elements.length;
    const startX = elements[0].offsetLeft;
    const times: number[] = [];
    const widths: number[] = [];
    const xPercents: number[] = [];
    let curIndex = 0;
    const pixelsPerSecond = (config.speed || 1) * 100;
    const snap = config.snap === false
        ? (value: number) => value
        : gsap.utils.snap(config.snap || 1);

    gsap.set(elements, {
        xPercent: (i, el) => {
            const w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px") as string);
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px") as string) / w * 100 + Number(gsap.getProperty(el, "xPercent")));
            return xPercents[i];
        },
        force3D: true
    });

    gsap.set(elements, { x: 0 });
    const totalWidth = elements[length - 1].offsetLeft
        + xPercents[length - 1] / 100 * widths[length - 1]
        - startX
        + elements[length - 1].offsetWidth * Number(gsap.getProperty(elements[length - 1], "scaleX"))
        + (parseFloat(String(config.paddingRight || 0)) || 0);

    for (let i = 0; i < length; i += 1) {
        const item = elements[i];
        const curX = xPercents[i] / 100 * widths[i];
        const distanceToStart = item.offsetLeft + curX - startX;
        const distanceToLoop = distanceToStart + widths[i] * Number(gsap.getProperty(item, "scaleX"));
        tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
            .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars: gsap.TweenVars = {}) {
        if (Math.abs(index - curIndex) > length / 2) {
            index += index > curIndex ? -length : length;
        }

        const newIndex = gsap.utils.wrap(0, length, index);
        let time = times[newIndex];

        if (time > tl.time() !== index > curIndex) {
            vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }

        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }

    tl.next = (vars = {}) => toIndex(curIndex + 1, vars);
    tl.previous = (vars = {}) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index: number, vars = {}) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true);

    if (config.reversed) {
        tl.vars.onReverseComplete?.();
        tl.reverse();
    }

    return tl;
}

export default function WorkSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const { stage } = useTransitionState();
    const isTransitioning = stage !== "none";

    const persistHomeScroll = () => {
        sessionStorage.setItem("home-scroll-y", String(window.scrollY));
    };

    useGSAP(() => {
        if (!railRef.current || !sectionRef.current) return;

        const items = gsap.utils.toArray<HTMLElement>(".marquee-item", railRef.current);
        const idleTimeScale = 0.38;
        let settleTween: gsap.core.Tween | null = null;

        // Initialize the seamless horizontal loop
        const loop = horizontalLoop(items, {
            repeat: -1,
            speed: 1.5,
            paddingRight: 50,
        });

        loop.timeScale(idleTimeScale);

        const obs = Observer.create({
            target: sectionRef.current,
            type: "wheel,touch",
            onChangeY(self) {
                const direction = self.deltaY > 0 ? 1 : -1;
                const boost = gsap.utils.clamp(2, 3, 2 + Math.abs(self.deltaY) / 180);

                settleTween?.kill();

                gsap.to(loop, {
                    timeScale: direction * boost,
                    duration: 0.35,
                    ease: "power3.out",
                    overwrite: "auto"
                });

                settleTween = gsap.to(loop, {
                    timeScale: direction * idleTimeScale,
                    duration: 1.4,
                    delay: 0.08,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });

        // 1. Grid Reveal Animation
        const cards = gsap.utils.toArray<HTMLElement>(".project-card", sectionRef.current);
        cards.forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0.3 },
                {
                    opacity: 1,
                    duration: 0.4,
                    delay: index * 0.04,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

        return () => {
            settleTween?.kill();
            if (loop) loop.kill();
            if (obs) obs.kill();
        };
    }, { scope: sectionRef });

    return (
        <section
            id="work-section"
            ref={sectionRef}
            className="flex min-h-[100svh] w-full flex-col items-center justify-start overflow-hidden py-24 md:py-40"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
        >
            <h2 className="sr-only">Selected work</h2>
            <div className="mb-16 w-full overflow-hidden md:mb-32">
                <div
                    ref={railRef}
                    className="rail flex whitespace-nowrap py-6 font-sans text-[12vw] font-bold leading-none tracking-tighter uppercase opacity-100 md:py-10 md:text-[8vw]"
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <p key={i} aria-hidden="true" className="marquee-item px-10">
                            Some of my work
                        </p>
                    ))}
                </div>
            </div>

            <div className="mb-20 flex w-full flex-col gap-12 px-[5vw] md:mb-32 md:w-[82vw] md:max-w-none md:px-0 lg:w-[78vw]">
                {projects.map((project, index) => {
                    return (
                        <div key={project.slug} className="w-full flex flex-col pt-8 md:pt-12">
                            <ProjectCard
                                project={project}
                                href={`/work/${project.slug}`}
                                disabled={isTransitioning}
                                onNavigate={persistHomeScroll}
                            />
                            {index !== projects.length - 1 && (
                                <div className="mt-8 h-px w-full bg-[var(--foreground)]/15 md:mt-12" />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="py-6 md:py-10"></div>
        </section>
    );
}
