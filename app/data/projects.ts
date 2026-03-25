export interface ProjectData {
    slug: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    technologies: string[];
    year: string;
    imageSrc: string;
    imageAlt: string;
    linkHref?: string;
    linkLabel?: string;
}

export interface ProjectTheme {
    panelColor: string;
}

export const projectThemesBySlug: Record<string, ProjectTheme> = {
    "nba-predictor": {
        panelColor: "#16191f",
    },
    "threejs-worlds": {
        panelColor: "#323232",
    },
    portfolio: {
        panelColor: "#171717",
    },
};

export const projects: ProjectData[] = [
    {
        slug: "nba-predictor",
        title: "NBA Predictor",
        shortDescription: "AI-powered interface for NBA matchup predictions and analysis.",
        longDescription: "An AI-assisted NBA prediction interface that combines matchup analysis, live NBA data, and machine learning predictions in a focused desktop experience. The platform integrates AI-driven responses with statistical insights, allowing users to explore game predictions, analyze team performance, and interact with real-time sports data through an intuitive interface.",
        technologies: ["NextJS", "Gemini AI", "Machine Learning"],
        year: "2026",
        imageSrc: "/projects/nba-predictor/default.png",
        imageAlt: "NBA Predictor AI shown on a laptop mockup.",
        linkHref: "https://github.com/nachodoria/nba-predictor",
        linkLabel: "View More",
    },
    {
        slug: "threejs-worlds",
        title: "Three JS Worlds",
        shortDescription: "Interactive Three.js scenes exploring real-time 3D rendering.",
        longDescription: "A collection of interactive Three.js experiments and 3D web scenes created while following Bruno Simon’s Three.js Journey course. The project explores real-time rendering, animation systems, shaders, and physics-based interactions through hands-on implementations. Notable scenes include the Golden Portal and the Galaxy Generator, demonstrating particle systems, custom materials, and immersive WebGL environments.",
        technologies: ["ThreeJS", "Blender"],
        year: "2024",
        imageSrc: "/projects/threejs-worlds/default.png",
        imageAlt: "Three JS Worlds project shown on a laptop mockup with a particle boat scene.",
        linkHref: "https://three-js-worlds-tau.vercel.app/",
        linkLabel: "View More",
    },
    {
        slug: "portfolio",
        title: "Personal Portfolio",
        shortDescription: "High-performance portfolio with advanced animations and smooth scrolling.",
        longDescription: "A high-performance personal portfolio featuring advanced GSAP animations, a truly infinite marquee, and perfectly fluid smooth scrolling. The project focuses on creating a polished interactive experience with carefully tuned motion design, responsive layouts, and performance-first rendering techniques built with NextJS and Tailwind.",
        technologies: ["NextJS", "GSAP", "Lenis", "Tailwind CSS"],
        year: "2026",
        imageSrc: "/projects/portfolio/default.png",
        imageAlt: "Portfolio project shown on two phone mockups.",
        linkHref: "https://ignacio-doria.vercel.app/",
        linkLabel: "View More",
    },
];

export const projectsBySlug = Object.fromEntries(
    projects.map((project) => [project.slug, project]),
) as Record<string, ProjectData>;
