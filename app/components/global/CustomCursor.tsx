"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const cursor = cursorRef.current;
        const text = textRef.current;
        if (!cursor || !text) return;

        const moveMouse = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power4.out",
                overwrite: "auto",
            });
        };

        const handleHover = (e: any) => {
            const isHovering = e.detail?.isHovering;

            if (isHovering) {
                gsap.to(cursor, {
                    width: 80,
                    height: 80,
                    backgroundColor: "var(--background)",
                    mixBlendMode: "normal",
                    duration: 0.8,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
                });
                gsap.to(text, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    delay: 0.1
                });
            } else {
                gsap.to(cursor, {
                    width: 24,
                    height: 24,
                    backgroundColor: "var(--foreground)",
                    mixBlendMode: "difference",
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });
                gsap.to(text, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.3
                });
            }
        };

        window.addEventListener("mousemove", moveMouse);
        window.addEventListener("cursorHover", handleHover as any);

        return () => {
            window.removeEventListener("mousemove", moveMouse);
            window.removeEventListener("cursorHover", handleHover as any);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
            style={{
                width: "24px",
                height: "24px",
                transform: "translate(-50%, -50%)",
                backgroundColor: "var(--foreground)",
                mixBlendMode: "difference"
            }}
        >
            <span
                ref={textRef}
                className="text-black text-3xl font-light opacity-0 scale-50 inline-block mb-1"
            >
                +
            </span>
        </div>
    );
}
