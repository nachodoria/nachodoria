"use client";
import MoveUp from '../../components/MoveUp';
import AnimatedLink from "../../components/Link.jsx"
import Object from "../../components/Object.jsx";

export default function Projects() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-20 sm:px-10">
            <MoveUp delay={0} className="mb-10 text-center h-auto flex justify-center items-center font-monosans text-2xl font-medium text-foreground subpixel-antialiased sm:text-4xl" text={"Recent Projects"}></MoveUp>

            <div className="w-full max-w-5xl pb-8 text-center sm:pb-10">
                <div className="font-monosans text-xl font-medium text-foreground subpixel-antialiased sm:text-2xl">
                    <MoveUp text={"NBA Predictor (Next.js, React, Python, Machine Learning)"} delay={0.5} cl="h-auto px-2 text-center leading-snug"></MoveUp>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 text-center">
                    <div className="font-monosans text-md font-regular text-foreground/40 subpixel-antialiased sm:text-lg">
                        <MoveUp text={"2025"} delay={1} cl="text-sm font-monosans font-regular text-foreground subpixel-antialiased text-center"></MoveUp>
                    </div>

                </div>
            </div>
            <div className="w-full max-w-5xl pb-8 text-center sm:pb-10">
                <div className="font-monosans text-xl font-medium text-foreground subpixel-antialiased sm:text-2xl">
                    <MoveUp text={"Personal Portfolio (NextJS, Framer-Motion, Observer API, NextUI)"} delay={1.2} cl="h-auto px-2 text-center leading-snug"></MoveUp>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 text-center">
                    <div className="font-monosans text-md font-regular text-foreground/40 subpixel-antialiased sm:text-lg">
                        <MoveUp text={"2024 -"} delay={1.4} cl="text-sm font-monosans font-regular text-foreground subpixel-antialiased text-center"></MoveUp>
                    </div>
                    <AnimatedLink delay={1.4} h="#" text={"Visit Here"} className="text-blue-400 hover:text-blue-400/90 duration-100 text-md sm:text-lg font-monosans font-regular outline-none "></AnimatedLink>
                </div>
            </div>
            <div className="w-full max-w-5xl pb-8 text-center sm:pb-10">
                <div className="font-monosans text-xl font-medium text-foreground subpixel-antialiased sm:text-2xl">
                    <MoveUp text={"Text Animations by Ignacio (NextJS, Framer-motion, Observer API)"} delay={1.6} cl="h-auto px-2 text-center leading-snug"></MoveUp>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 text-center">
                    <div className="font-monosans text-md font-regular text-foreground/40 subpixel-antialiased sm:text-lg">
                        <MoveUp text={"2023 -"} delay={1.8} cl="text-sm font-monosans font-regular text-foreground subpixel-antialiased text-center"></MoveUp>
                    </div>
                    <AnimatedLink delay={1.8} h="https://cool-text-animations.vercel.app" text={"Visit Here"} className="text-blue-400 hover:text-blue-400/90 duration-100 text-md sm:text-lg font-monosans font-regular outline-none "></AnimatedLink>
                </div>
            </div>
            <div className="w-full max-w-5xl pb-8 text-center sm:pb-10">
                <div className="font-monosans text-xl font-medium text-foreground subpixel-antialiased sm:text-2xl">
                    <MoveUp text={"Galaxy Generator / Golden Portal (ThreeJS)"} delay={2} cl="h-auto px-2 text-center leading-snug"></MoveUp>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 text-center">
                    <div className="font-monosans text-md font-regular text-foreground/40 subpixel-antialiased sm:text-lg">
                        <MoveUp text={"2022 -"} delay={2.2} cl="text-sm font-monosans font-regular text-foreground subpixel-antialiased text-center"></MoveUp>
                    </div>
                    <AnimatedLink delay={2.2} h="https://galaxy-generator-peach.vercel.app" text={"Galaxy Generator"} className="text-blue-400 hover:text-blue-400/90 duration-100 text-md sm:text-lg font-monosans font-regular outline-none "></AnimatedLink>
                    <Object dl={2.25} cl="px-2 text-foreground/40">
                        <span>|</span>
                    </Object>
                    <AnimatedLink delay={2.3} h="https://threejs-journey-portalscene.vercel.app" text={"Golden Portal"} className="text-blue-400 hover:text-blue-400/90 duration-100 text-md sm:text-lg font-monosans font-regular outline-none "></AnimatedLink>

                </div>
            </div>

        </div>
    )
}
