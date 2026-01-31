import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const BubbleBackground = ({ interactive = false, className = '' }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!interactive) return;

        const handleMouseMove = (event) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [interactive]);

    return (
        <div className={`fixed inset-0 w-full h-full overflow-hidden -z-50 ${className}`}>
            {/* Ambient Bubbles */}
            <Bubble
                color="bg-blue-600"
                size="w-96 h-96"
                top="-top-20"
                left="-left-20"
                delay={0}
                duration={20}
            />
            <Bubble
                color="bg-purple-600"
                size="w-[30rem] h-[30rem]"
                top="top-1/2"
                left="left-1/3"
                delay={2}
                duration={25}
            />
            <Bubble
                color="bg-indigo-500"
                size="w-80 h-80"
                top="bottom-0"
                left="right-0"
                delay={4}
                duration={18}
            />
            <Bubble
                color="bg-violet-600"
                size="w-72 h-72"
                top="top-20"
                left="right-20"
                delay={1}
                duration={22}
            />

            {/* Interactive Bubble */}
            {interactive && (
                <motion.div
                    className="absolute bg-sky-500 rounded-full blur-[100px] opacity-40 pointer-events-none w-64 h-64"
                    animate={{
                        x: mousePosition.x - 128,
                        y: mousePosition.y - 128,
                    }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 200,
                        mass: 0.5
                    }}
                />
            )}

            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
        </div>
    );
};

const Bubble = ({ color, size, top, left, delay, duration }) => (
    <motion.div
        className={`absolute rounded-full blur-[80px] opacity-40 ${color} ${size} ${top} ${left}`}
        animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: delay,
        }}
    />
);

export default BubbleBackground;
