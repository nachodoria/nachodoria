export interface ProjectGalleryImage {
    src: string;
    width: number;
    height: number;
    alt: string;
    maxWidth?: number;
}

export interface ProjectData {
    slug: string;
    title: string;
    category: string;
    shortDescription: string;
    longDescription: string;
    technologies: string[];
    year: string;
    imageSrc: string;
    imageAlt: string;
    detailImageSrc?: string;
    linkHref?: string;
    linkLabel?: string;
    cardImage?: {
        src: string;
        width: number;
        height: number;
    };
    hideHeroImage?: boolean;
    gallery?: ProjectGalleryImage[];
}

export interface WorkExperience {
    slug: string;
    role: string;
    company: string;
    period: string;
    description: string;
    technologies: string[];
}

export const workExperience: WorkExperience[] = [
    {
        slug: "government-of-ontario",
        role: "Developer Intern",
        company: "Government of Ontario",
        period: "2026–Present",
        description: "I configure and deploy call centre solutions for Government of Ontario clients, working with enterprise contact centre platforms, IVR systems, and telecommunications infrastructure to support critical public services.",
        technologies: ["Contact Centre", "IVR", "Telecommunications"],
    },
];

export const projects: ProjectData[] = [
    {
        slug: "nba-predictor",
        title: "NBA Predictor",
        category: "AI & Machine Learning",
        shortDescription: "AI-powered interface for NBA matchup predictions and analysis.",
        longDescription: "An AI-assisted NBA prediction interface that combines matchup analysis, live NBA data, and machine learning predictions in a focused desktop experience. The platform integrates AI-driven responses with statistical insights, allowing users to explore game predictions, analyze team performance, and interact with real-time sports data through an intuitive interface.",
        technologies: ["NextJS", "Gemini AI", "Machine Learning"],
        year: "2026",
        imageSrc: "/projects/nba-predictor/default.svg",
        imageAlt: "A robot emoji centered on a dark field, standing in for NBA Predictor's AI engine.",
        linkHref: "https://github.com/nachodoria/nba-predictor",
        linkLabel: "View More",
        gallery: [
            {
                src: "/projects/nba-predictor/detail.svg",
                width: 1600,
                height: 1200,
                alt: "A robot and a basketball side by side on a crimson field, pairing the AI engine with the NBA data it analyzes.",
            },
        ],
    },
    {
        slug: "threejs-worlds",
        title: "Three JS Worlds",
        category: "3D & WebGL",
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
        category: "Web Development",
        shortDescription: "High-performance portfolio with advanced animations and smooth scrolling.",
        longDescription: "A high-performance personal portfolio featuring advanced GSAP animations, a truly infinite marquee, and perfectly fluid smooth scrolling. The project focuses on creating a polished interactive experience with carefully tuned motion design, responsive layouts, and performance-first rendering techniques built with NextJS and Tailwind.",
        technologies: ["NextJS", "GSAP", "Lenis", "Tailwind CSS"],
        year: "2026",
        imageSrc: "/projects/portfolio/01-cover.svg",
        imageAlt: "Brand identity artwork for the Personal Portfolio project — ink and clay marks on a dotted ground.",
        linkHref: "https://idoria.dev/",
        linkLabel: "View More",
        cardImage: {
            src: "/projects/portfolio/02-mark.svg",
            width: 1200,
            height: 1200,
        },
        hideHeroImage: true,
        gallery: [
            {
                src: "/projects/portfolio/03-ripple.svg",
                width: 1600,
                height: 1200,
                alt: "Clay-orange dot field rippling outward across a dark canvas, part of the brand identity system.",
            },
            {
                src: "/projects/portfolio/04-poster-caged.svg",
                width: 1200,
                height: 1600,
                alt: "Large display type caged inside a dot grid on a cream poster layout.",
                maxWidth: 900,
            },
        ],
    },
];

export const projectsBySlug = Object.fromEntries(
    projects.map((project) => [project.slug, project]),
) as Record<string, ProjectData>;
