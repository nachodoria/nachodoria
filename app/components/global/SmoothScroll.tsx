"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        let locomotiveScroll: any;

        (async () => {
            const LocomotiveScroll = (await import("locomotive-scroll")).default;

            locomotiveScroll = new LocomotiveScroll({
                lenisOptions: {
                    lerp: 0.1,
                    duration: 1.2,
                    smoothWheel: true,
                },
                initCustomTicker: (render: any) => {
                    gsap.ticker.add(render);
                },
                destroyCustomTicker: (render: any) => {
                    gsap.ticker.remove(render);
                },
            });
        })();

        return () => {
            if (locomotiveScroll) locomotiveScroll.destroy();
        };
    }, []);

    return <>{children}</>;
}
