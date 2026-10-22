"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const services = [
    {
        title: "Full stack web development",
        description: "You have an idea, I build it.",
    },
    {
        title: "Service Two",
        description: "Placeholder description for this service — to be filled in later.",
    },
    {
        title: "Service Three",
        description: "Placeholder description for this service — to be filled in later.",
    },
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const rows = gsap.utils.toArray<HTMLElement>(".service-row", sectionRef.current ?? undefined);
        gsap.fromTo(
            rows,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power2.out", delay: 0.1 }
        );
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="services"
            className="flex w-full flex-col gap-12 px-[6vw] py-24 md:gap-16 md:px-[5vw] md:py-36"
        >
            <h2 className="font-display text-4xl uppercase leading-none tracking-tight text-[var(--ink)] md:text-6xl">
                Services
            </h2>

            <div className="flex w-full flex-col">
                {services.map((service, index) => (
                    <div
                        key={service.title}
                        className={`service-row flex w-full flex-col gap-2 border-[var(--border)] py-7 md:flex-row md:items-center md:gap-10 md:py-9 ${index === 0 ? "border-t" : ""} border-b`}
                    >
                        <h3 className="font-sans text-2xl font-medium tracking-tight text-[var(--ink)] md:w-[38%] md:text-3xl">
                            {service.title}
                        </h3>
                        <p className="max-w-2xl text-base leading-[1.6] text-[var(--muted)] md:text-lg">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
