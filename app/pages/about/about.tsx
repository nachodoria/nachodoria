"use client";
import Ease from "../../components/Ease"
import MoveUp from '../../components/MoveUp';
import Object from '../../components/Object.jsx';
import { Button } from "@nextui-org/react";


export default function About() {
    function openPage() {
        window.open("https://www.linkedin.com/in/ignacio-doria-oberman-459b33267/");
    }
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-20 sm:px-10 md:flex-row md:items-center md:gap-20 md:px-12'>
                <div className='flex w-full max-w-3xl flex-col items-start justify-center'>
                    <MoveUp className="mb-3 text-center h-auto flex justify-center items-center font-monosans text-2xl font-medium text-foreground subpixel-antialiased sm:text-4xl sm:mb-6" text="About me"></MoveUp>

                    <MoveUp delay={1} className="pb-4 text-left font-monosans font-medium text-xl text-foreground subpixel-antialiased sm:text-2xl" text="Educational Background"></MoveUp>
                    <div className="flex w-full flex-row items-start pb-4 font-monosans font-regular text-foreground subpixel-antialiased">
                        <Object dl={2}
                            cl='h-3 min-w-3 bg-foreground/40 rounded-full mr-4 mt-2'>
                        </Object>
                        <div className='flex flex-col items-start justify-between'>
                            <MoveUp delay={2} className="text-left font-monosans font-regular text-base text-foreground subpixel-antialiased sm:text-xl" text="York University: BSc Computer Science"></MoveUp>
                            <MoveUp delay={2.5} className="text-left text-foreground/70 font-monosans font-regular text-base text-foreground subpixel-antialiased sm:text-xl" text="2023 - present"></MoveUp>
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-start font-monosans font-regular  text-foreground subpixel-antialiased">
                        <Object dl={2}
                            cl='h-3 min-w-3 bg-foreground/40 rounded-full mr-4 mt-2'>
                        </Object>
                        <div className='flex flex-col items-start justify-center'>
                            <MoveUp delay={2} className="text-left font-monosans font-regular text-base text-foreground subpixel-antialiased sm:text-xl" text="ORT Argentina: Bachelor in Information Technology (Graduated with Honors)"></MoveUp>
                            <MoveUp delay={2.5} className="text-left text-foreground/70 font-monosans font-regular text-base text-foreground subpixel-antialiased sm:text-xl" text="2018 - 2022"></MoveUp>
                        </div>
                    </div>
                    <MoveUp delay={1} className="pt-4 pb-4 text-left font-monosans font-medium text-xl text-foreground subpixel-antialiased sm:text-2xl sm:pt-10"  text="Languages"></MoveUp>
                    <div className="flex w-full flex-row items-start pb-4 font-monosans font-regular text-foreground subpixel-antialiased">
                        <Object dl={2}
                            cl='h-3 min-w-3 bg-foreground/40 rounded-full mr-4 mt-2'>
                        </Object>
                        <div className='flex flex-col items-start justify-between'>
                            <MoveUp delay={2} className="text-left font-monosans font-regular text-base text-foreground subpixel-antialiased sm:text-xl" text="Spanish"></MoveUp>
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-start font-monosans font-regular text-foreground subpixel-antialiased">
                        <Object dl={2}
                            cl='h-3 min-w-3 bg-foreground/40 rounded-full mr-4 mt-2 '>
                        </Object>
                        <div className='flex flex-col items-start justify-center '>
                            <MoveUp delay={2} className="text-left font-monosans font-regular text-base text-foreground subpixel-antialiased md:text-xl" text="English"></MoveUp>
                        </div>
                    </div>
                    <Object dl={3}>
                        <Button target="_blank" onPress={openPage} size="lg" color="primary" className="mt-10">Let's Talk</Button>
                    </Object>
                </div>
                <div className='hidden w-full max-w-sm flex-col items-end md:flex'>
                    <Ease delay={2.5} cl="max-w-sm text-right font-monosans font-regular text-lg text-foreground subpixel-antialiased lg:text-2xl" text={"Originally from Buenos Aires, Argentina, I now call Toronto, Canada home. Currently pursuing my passion for computer science as a student at York University, striving to enrich both my expertise and practical experience in the field."}></Ease>
                </div>

            </div>
        </div>
    )
}
