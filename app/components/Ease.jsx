"use client"; // This is a client component 👈🏽
import { useAnimation, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Ease({ text, delay, cl  }) {
    const controls = useAnimation();

    const { ref, inView } = useInView({
        threshold: 1,
        triggerOnce: true

    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const easeIn = {
        hidden: {
            opacity: 0,
            transition: { type: "tween", duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] }

        },
        visible: {
            opacity: 1,
            transition: {
                type: "tween",
                delay: delay,
                duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9]
            }

        }
    }

    return (
        <>
  
            <motion.div
                className={cl}>
                    <motion.h1
                        initial="hidden"
                        animate={controls}
                        variants={easeIn}
                        style={{ willChange: "opacity" }}
                        ref={ref}
                    >
                        {text}
                    </motion.h1>

            </motion.div >

        </>
    )
}
