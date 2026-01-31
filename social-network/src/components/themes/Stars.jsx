import React, { useRef, useEffect } from 'react';

const StarsBackground = ({
    starColor = '#FFF',
    className = ''
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let stars = [];
        const numStars = 300;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        };

        window.addEventListener('resize', resize);

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random() * width // simple depth
                });
            }
        };

        initStars();

        const animate = () => {
            // Clear canvas for transparency
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = starColor;

            stars.forEach(star => {
                // Move star towards screen
                star.z -= 0.5; // speed
                if (star.z <= 0) {
                    star.x = Math.random() * width;
                    star.y = Math.random() * height;
                    star.z = width;
                }

                // Project 3D to 2D
                const k = 128.0 / star.z;
                const px = (star.x - width / 2) * k + width / 2;
                const py = (star.y - height / 2) * k + height / 2;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const size = (1 - star.z / width) * 2; // closer is bigger
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestAnimationFrame(animate);
        };

        const animationRef = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef);
        };
    }, [starColor]);

    const isDark = starColor === '#FFFFFF' || starColor === 'white';

    return (
        <div
            className={`fixed inset-0 w-full h-full -z-50 ${className}`}
            style={{
                background: isDark
                    ? 'radial-gradient(ellipse at bottom, #262626 0%, #000 100%)'
                    : 'radial-gradient(ellipse at bottom, #f5f5f5 0%, #fff 100%)'
            }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
};

export default StarsBackground;
