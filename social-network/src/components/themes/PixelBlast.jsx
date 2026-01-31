import { useRef, useEffect } from 'react';
import './PixelBlast.css';

const PixelBlast = ({
    colors = ['#5227FF', '#FF9FFC', '#222222', '#FFFFFF'],
    gap = 2,
    speed = 0.05,
    minSize = 4,
    maxSize = 10,
    className = ''
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        let animationId;
        let particles = [];
        let w, h;
        let time = 0;

        const resize = () => {
            w = canvas.parentElement.offsetWidth;
            h = canvas.parentElement.offsetHeight;
            canvas.width = w;
            canvas.height = h;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const cols = Math.ceil(w / (minSize + gap));
            const rows = Math.ceil(h / (minSize + gap));
            const numParticles = cols * rows * 0.4; // Fill about 40%

            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: minSize + Math.random() * (maxSize - minSize),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speedX: (Math.random() - 0.5) * speed * 10,
                    speedY: (Math.random() - 0.5) * speed * 10,
                    pulseSpeed: 0.02 + Math.random() * 0.05,
                    pulseOffset: Math.random() * Math.PI * 2
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.x < -p.size) p.x = w + p.size;
                if (p.x > w + p.size) p.x = -p.size;
                if (p.y < -p.size) p.y = h + p.size;
                if (p.y > h + p.size) p.y = -p.size;

                // Pulsate size
                const scale = 1 + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.2;
                const currentSize = p.size * scale;

                ctx.fillStyle = p.color;
                // Draw squares for pixel look
                ctx.fillRect(p.x - currentSize / 2, p.y - currentSize / 2, currentSize, currentSize);
            });

            time += 1;
            animationId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [colors, gap, speed, minSize, maxSize]);

    return <canvas ref={canvasRef} className={`pixel-blast-canvas ${className}`} />;
};

export default PixelBlast;
