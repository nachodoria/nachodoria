"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Use quickSetter for high-performance updates
        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");

        const moveMouse = (e: MouseEvent) => {
            // Smoothly animate the cursor to the mouse position
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
            });
        };

        window.addEventListener("mousemove", moveMouse);

        return () => {
            window.removeEventListener("mousemove", moveMouse);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                backgroundColor: "var(--foreground)",
                transform: "translate(-50%, -50%)",
            }}
        />
    );
}
