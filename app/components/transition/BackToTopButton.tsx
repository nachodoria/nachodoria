"use client";

import StackLabel from "@/app/components/global/StackLabel";

export default function BackToTopButton() {
    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="dot-after inline-flex w-fit items-center rounded-full border border-[var(--ink)]/25 px-5 py-2 font-sans text-sm text-[var(--ink)] transition-colors hover:border-[var(--ink)]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
            <StackLabel label="Back to Top" speed="fast" />
        </button>
    );
}
