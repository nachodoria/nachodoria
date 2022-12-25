import React from 'react';
import { motion } from 'framer-motion';

function AnimatedDivider({  }) {
    const child = {
        visible: {
            innerWidth: 1,
            transition: {
                type: "spring",
                damping: 60,
                stiffness: 100,
            },
        },
        hidden: {
            innerWidth: 0,
            transition: {
                type: "spring",
                damping: 60,
                stiffness: 100,
            }
        }
    }

    return (
        <motion.div className='divider' variants={child} initial="hidden" whileInView="visible">
        </motion.div>
    );
}

export default AnimatedDivider