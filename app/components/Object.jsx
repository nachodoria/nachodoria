import { useEffect } from "react";
import styled from "styled-components";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Object(props, cl, dl) {
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

    const animation = {
        hidden: {
            opacity: 0,
            y: 10,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "tween",
                delay: props.dl,
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };
    return (
        <motion.div
            ref={ref}
            aria-hidden="true"
            initial="hidden"
            animate={ctrls}
            style={{ willChange: "transform, opacity" }}
            variants={animation}
            className={props.cl}>
                {props.children}
            </motion.div>
    )
}
