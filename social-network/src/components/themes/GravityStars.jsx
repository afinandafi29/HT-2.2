import React, { useCallback, useEffect, useRef } from "react";

const GravityStarsBackground = ({
    starCount = 100,
    starColor = "255, 255, 255",
    className = "",
}) => {
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationFrameId;

        // Resize handler
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            starsRef.current = [];
            for (let i = 0; i < starCount; i++) {
                starsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() * 0.5 - 0.25,
                    vy: Math.random() * 0.5 - 0.25,
                    radius: Math.random() * 1.5 + 0.5,
                });
            }
        };

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        resize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const stars = starsRef.current;
            const mouse = mouseRef.current;

            stars.forEach((star) => {
                // Base movement
                star.x += star.vx;
                star.y += star.vy;

                // Bounce off walls
                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                // Gravity effect
                if (mouse.active) {
                    const dx = mouse.x - star.x;
                    const dy = mouse.y - star.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = Math.max(0, (500 - distance) / 500); // Effect radius 500

                    if (distance < 500) {
                        star.x += (dx / distance) * force * 2; // Attraction strength
                        star.y += (dy / distance) * force * 2;
                    }
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${starColor}, ${mouse.active ? 1 : 0.5})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [starCount, starColor]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 w-full h-full -z-50 ${className}`}
        />
    );
};

export default GravityStarsBackground;
