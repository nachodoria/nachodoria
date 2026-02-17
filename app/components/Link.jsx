import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "@nextui-org/react";


export default function AnimatedLink(text, className, delay, h) {
    const txt = text.text;
    const cl = text.className;
    const dl = text.delay;
    const href = text.h;
    const ctrls = useAnimation();

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            ctrls.start("visible");
        }
    }, [ctrls, inView]);

    const characterAnimation = {
        hidden: {
            opacity: 0,
            y: 10,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "tween",
                delay: dl,
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    return (
        <motion.div className={cl}
            ref={ref}
            aria-hidden="true"
            initial="hidden"
            animate={ctrls}
            variants={characterAnimation}
            style={{ willChange: "transform, opacity", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}>
            <Link target="_blank" color="primary" href={href}>
                {txt}
            </Link>
        </motion.div>
    );
}
