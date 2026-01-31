import { useRef, useEffect } from 'react';
import './Galaxy.css';

export default function Galaxy() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let stars = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 2,
                    speed: Math.random() * 0.5 + 0.1
                });
            }
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 10, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            stars.forEach(star => {
                star.z -= star.speed;
                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                }

                const k = 128 / star.z;
                const px = (star.x - cx) * k + cx;
                const py = (star.y - cy) * k + cy;
                const size = (1 - star.z / canvas.width) * star.size * 2;

                const brightness = 1 - star.z / canvas.width;
                ctx.fillStyle = `rgba(${200 + brightness * 55}, ${150 + brightness * 105}, ${255}, ${brightness})`;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="galaxy-container" />;
}
