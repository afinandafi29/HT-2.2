import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HexagonBackground = ({ className = '' }) => {
    const [hexagons, setHexagons] = useState([]);

    useEffect(() => {
        // Calculate grid
        const hexWidth = 100;
        const hexHeight = 115;
        const rows = Math.ceil(window.innerHeight / (hexHeight * 0.75)) + 1;
        const cols = Math.ceil(window.innerWidth / hexWidth) + 1;

        const newHexagons = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const xOffset = (r % 2 === 0) ? 0 : hexWidth / 2;
                newHexagons.push({
                    id: `${r}-${c}`,
                    x: c * hexWidth + xOffset - 50,
                    y: r * (hexHeight * 0.75) - 50,
                    size: Math.random() > 0.8 ? 'lit' : 'dim'
                });
            }
        }
        setHexagons(newHexagons);
    }, []);

    return (
        <div className={`fixed inset-0 w-full h-full -z-50 overflow-hidden ${className}`}>
            <svg className="w-full h-full opacity-30">
                <defs>
                    <pattern id="hex-pattern" width="100" height="115" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                        <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-pattern)" />
            </svg>

            {/* Pulsing Hexagons */}
            {hexagons.filter(h => h.size === 'lit').slice(0, 20).map((hex) => (
                <motion.div
                    key={hex.id}
                    className="absolute w-[50px] h-[57px] bg-sky-500/20"
                    style={{
                        left: hex.x,
                        top: hex.y,
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                    }}
                    animate={{
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}
        </div>
    );
};

export default HexagonBackground;
