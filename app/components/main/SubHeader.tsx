"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface SubHeaderProps {
    isReady: boolean;
}

export default function SubHeader({ isReady }: SubHeaderProps) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = container.current?.querySelectorAll<HTMLElement>(".item");
        if (isReady && items?.length) {
            gsap.to(items, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            });
        }
    }, [isReady]);

    return (
        <div
            ref={container}
            data-scroll
            data-scroll-speed="0.2"
            className="mt-4 flex w-full flex-col items-center gap-1 px-[5vw] text-center font-mono text-[4.2vw] font-medium tracking-tight text-[var(--foreground-tertiary)] sm:text-[3.4vw] md:flex-row md:justify-between md:px-[2vw] md:text-3xl lg:text-4xl"
        >
            <span className="item opacity-0">Software Developer</span>
            <span className="item opacity-0">Toronto, CA</span>
        </div>
    );
}
