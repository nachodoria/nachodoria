"use client";
import Ease from "../../components/Ease"
import MoveUp from '../../components/MoveUp';
import Object from "@/app/components/Object.jsx";
import { Button } from "@nextui-org/react";

export default function Home() {
    function openPage() {
        window.open("https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/");
    }
    return (
        <div className="relative min-h-screen w-full">
            <Object dl={2}>
                <div className="absolute right-4 top-4 pb-6 font-monosans text-sm font-medium text-foreground subpixel-antialiased sm:right-6 sm:top-6 sm:text-base md:right-10 md:top-10 md:text-xl">📍Toronto, Canada</div>
            </Object>
            <div className="flex min-h-screen w-full flex-col items-start justify-center px-6 py-20 sm:px-10 md:py-0">
                <div className="flex w-full max-w-5xl flex-col items-start justify-center">
                    <div className="flex flex-row flex-wrap items-center justify-center pb-4">
                        <MoveUp delay={0.1} text={"Hey! I'm Ignacio"} className="text-left h-auto font-monosans font-medium text-xl text-foreground subpixel-antialiased md:text-2xl"></MoveUp>
                        <Object dl={0.3} cl="pl-2">
                            <span>👋</span>
                        </Object>
                    </div>
                    <Ease delay={1.2} cl="h-auto w-full text-left font-monosans text-3xl font-medium leading-snug text-foreground subpixel-antialiased sm:text-5xl md:text-6xl" text="A dedicated Computer Science student with a passion for coding, aspiring to become a Software Engineer."></Ease>
                    <Object dl={1.4} cl="block">
                        <Button target="_blank" onPress={openPage} size="lg" color="primary" className="mt-8 sm:mt-10">LinkedIn</Button>
                    </Object>
                    <Object dl={1.6} cl="mt-10 hidden md:block">
                        <div className="h-auto text-center font-monosans text-lg font-medium text-foreground subpixel-antialiased">Scroll to get started  ⬇️</div>
                    </Object>
                </div>
            </div>
        </div>
    );
}
