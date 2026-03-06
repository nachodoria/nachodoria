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
        if (isReady) {
            gsap.to(".item", {
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
            className="flex justify-between w-full text-[var(--foreground)] font-sans font-medium text-[4vw] md:text-3xl lg:text-4xl tracking-tight mt-4 px-[2vw]"
        >
            <span className="item opacity-0">Software Developer</span>
            <span className="item opacity-0">Toronto, CA</span>
        </div>
    );
}
