import React, { useEffect, useRef } from 'react';

const FireworksBackground = ({
    population = 50,
    color = '#FFD700',
    className = ''
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        let fireworks = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);

        class Firework {
            constructor() {
                this.x = Math.random() * width;
                this.y = height;
                this.sx = Math.random() * 3 - 1.5;
                this.sy = -(Math.random() * 4 + 4);
                this.size = 2;
                this.hue = Math.floor(Math.random() * 360);
                this.shouldExplode = false;
            }

            update() {
                this.x += this.sx;
                this.y += this.sy;
                this.sy += 0.05; // gravity

                if (this.sy >= -2 || this.y <= 100) {
                    this.shouldExplode = true;
                }
            }

            draw() {
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class Particle {
            constructor(x, y, hue) {
                this.x = x;
                this.y = y;
                this.sx = Math.random() * 6 - 3;
                this.sy = Math.random() * 6 - 3;
                this.size = Math.random() * 2 + 1;
                this.hue = hue;
                this.life = 100;
            }

            update() {
                this.x += this.sx;
                this.y += this.sy;
                this.sy += 0.05;
                this.life -= 1;
                this.size *= 0.96;
            }

            draw() {
                ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.life / 100})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            // Clear canvas for transparency
            ctx.clearRect(0, 0, width, height);

            if (Math.random() < 0.05) { // Spawn rate
                fireworks.push(new Firework());
            }

            // Update fireworks
            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update();
                fireworks[i].draw();

                if (fireworks[i].shouldExplode) {
                    for (let j = 0; j < population; j++) {
                        particles.push(new Particle(fireworks[i].x, fireworks[i].y, fireworks[i].hue));
                    }
                    fireworks.splice(i, 1);
                }
            }

            // Update particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [population, color]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 w-full h-full -z-50 pointer-events-none ${className}`}
        />
    );
};

export default FireworksBackground;
