import React from 'react';
import { motion } from 'framer-motion';

const HoleBackground = ({ className = '' }) => {
    return (
        <div className={`fixed inset-0 w-full h-full -z-50 flex items-center justify-center overflow-hidden ${className}`}>
            {/* Hypnotic Gradients */}
            <motion.div
                className="absolute w-[200vw] h-[200vw] rounded-full border-[100px] border-slate-900"
                animate={{ scale: [1.5, 0.5], rotate: [0, 90] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute w-[150vw] h-[150vw] rounded-full border-[80px] border-slate-800"
                animate={{ scale: [1.5, 0.5], rotate: [0, -90] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
            />
            <motion.div
                className="absolute w-[100vw] h-[100vw] rounded-full border-[60px] border-slate-700"
                animate={{ scale: [1.5, 0.5], rotate: [0, 45] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
            />

            {/* The Hole */}
            <div className="absolute w-[20vw] h-[20vw] bg-black rounded-full shadow-[0_0_100px_50px_rgba(0,0,0,1)] z-10" />

            {/* Grid distortion simulation using radial gradient mask */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, transparent 10%, black 60%)'
                }}
            />
        </div>
    );
};

export default HoleBackground;
