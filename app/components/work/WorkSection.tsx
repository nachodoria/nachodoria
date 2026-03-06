"use client";

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
                const scrollFactor = 1;
                const pixelsPerSecond = 150;
                const scrollDeltaSeconds = (self.deltaY * scrollFactor) / pixelsPerSecond;

                // Flip base direction (1 = Forward/Left, -1 = Backward/Right)
                // Next.js scroll delta is positive for down, negative for up
                const direction = self.deltaY > 0 ? 1 : -1;
                gsap.set(loop, { timeScale: direction });

                // Duration 0 makes the reaction instant. No need for ease.
                gsap.to(loop, {
                    totalTime: `+=${scrollDeltaSeconds}`,
                    duration: 0,
                    overwrite: "auto"
                });
            }
        });

        return () => {
            loop.kill();
            obs.kill();
        };
    }, { scope: sectionRef });

    return (
        <section
            id="work-section"
            ref={sectionRef}
            className="w-full min-h-screen bg-[var(--foreground)] text-[var(--background)] flex flex-col items-center justify-start py-20 overflow-hidden"
        >
            {/* Horizontal Marquee Text Wrap */}
            <div className="w-full overflow-hidden select-none mb-20 border-y border-[var(--background-o)] py-10 flex flex-col will-change-transform">
                <div
                    ref={railRef}
                    className="rail flex whitespace-nowrap text-[8vw] font-sans font-bold leading-none tracking-tighter uppercase opacity-90 will-change-transform"
                >
                    {/* Items for the horizontal loop helper */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        <h4 key={i} className="marquee-item px-10">
                            Some of my work
                        </h4>
                    ))}
                </div>
            </div>

            {/* Content Placeholder */}
            <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
                <p className="text-2xl md:text-4xl font-sans font-medium tracking-tight opacity-50 max-w-3xl leading-snug">
                    Discover my latest projects and experiments through a lens of clean design and smooth, intuitive interaction.
                </p>
            </div>
        </section>
    );
}
