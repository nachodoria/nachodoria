"use client";

import { useTransitionState } from "next-transition-router";

interface IntroGateProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Holds the CSS entrance sequence paused (via [data-intro="paused"]) until the
 * route transition's curtain has cleared, so the content never animates while
 * it's still hidden. isReady is already true on a direct/hard load, so the
 * sequence starts immediately in that case.
 */
export default function IntroGate({ children, className }: IntroGateProps) {
    const { isReady } = useTransitionState();

    return (
        <div className={className} data-intro={isReady ? "running" : "paused"}>
            {children}
        </div>
    );
}
