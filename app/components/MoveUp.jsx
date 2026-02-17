import { useEffect } from "react";
import styled from "styled-components";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  white-space: nowrap;
`;

const Character = styled(motion.span)`
  display: inline-block;
  margin-right: -0.05em;
`;

export default function MoveUp(text, className, delay) {
    const txt = text.text;
    const cl = text.className ?? text.cl;
    const dl = text.delay;
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
        <motion.h1 className={cl} ref={ref}
            aria-hidden="true"
            initial="hidden"
            animate={ctrls}
            style={{ willChange: "transform, opacity" }}
            variants={characterAnimation}>
            {txt}
        </motion.h1>
    );
}
