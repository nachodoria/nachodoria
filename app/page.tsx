"use client"; // This is a client component 👈🏽
import Home from "./pages/home/home";
import About from "./pages/about/about";
import Projects from "./pages/projects/projects";
import Contact from "./pages/contact/contact";
import { NextUIProvider } from "@nextui-org/react";


export default function Main() {
  return (
    <NextUIProvider>
      <div className="snap-y snap-mandatory overflow-y-scroll h-screen w-full flex-grow z-0 ">
        <div className="snap-always snap-center">
          <Home />
        </div>
        <div className="snap-always snap-center">
          <About />
        </div>
        <div className="snap-always snap-center">
          <Projects />

        </div>
        <div className="snap-always snap-center">
          <Contact />

        </div>
      </div>

    </NextUIProvider>
  );
}
