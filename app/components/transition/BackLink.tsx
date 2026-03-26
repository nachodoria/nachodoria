"use client";

import { Link } from "next-transition-router";

export default function BackLink() {
    return (
        <Link
            href="/"
            scroll={false}
            className="inline-flex w-fit items-center gap-1 leading-none text-sm font-semibold uppercase tracking-[0.16em] opacity-70 transition-opacity duration-200 hover:opacity-100 md:text-base"
        >
            Back
        </Link>
    );
}
