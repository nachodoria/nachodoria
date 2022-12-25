import React from 'react';
import { motion } from 'framer-motion';

function AnimatedSubtitle({ text, cs }) {
    const words = text.split("");
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i }
        })
    }
    const child = {
        visible: {
            opacity: 0.65,
            transition: {
                type: "spring",
                damping: 60,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            transition: {
                type: "spring",
                damping: 60,
                stiffness: 100,
            }
        }
    }

    return (
        <motion.div className={cs} style={{ display: "flex", flexDirection: "row", marginLeft:"40px"}} variants={container} initial="hidden" whileInView="visible">
            {words.map((word, index) => (
                <motion.h1 style={{margin:"0"}} variants={child} key={index}>{word}</motion.h1>
            ))}
        </motion.div>
    );
}

export default AnimatedSubtitle;