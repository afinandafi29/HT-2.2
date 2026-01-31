import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './ColorBends.css'; // You'll create this CSS

const vertex = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uSpeed;
  uniform float uDistortion;

  varying vec2 vUv;

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    float t = uTime * uSpeed;
    
    // Wave calculations
    float wave1 = sin(st.x * 2.0 + t + cos(st.y * 3.0 + t * 0.5));
    float wave2 = cos(st.y * 3.0 - t * 0.8 + sin(st.x * 4.0 - t * 0.2));
    float wave3 = sin(length(st) * 4.0 - t * 1.5 + wave1 * uDistortion);
    
    // Mix pattern
    float pattern = (wave1 + wave2 + wave3) / 3.0; // range approx -1 to 1
    pattern = pattern * 0.5 + 0.5; // 0 to 1
    
    // Color mixing
    vec3 col = mix(uColor1, uColor2, pattern);
    col = mix(col, uColor3, smoothstep(0.2, 0.8, wave3 * 0.5 + 0.5));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
}

const ColorBends = ({
    colors = ['#FF2E63', '#08D9D6', '#252A34'],
    speed = 0.5,
    distortion = 1.0,
    className = ''
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new Renderer({
            alpha: true,
            dpr: Math.min(window.devicePixelRatio, 2),
            canvas
        });
        const gl = renderer.gl;

        const geometry = new Triangle(gl);
        const rgbColors = colors.map(hexToRgb);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2() },
                uColor1: { value: new Vec2(rgbColors[0]) }, // Passed as Vec3 equivalent manually below
                uColor2: { value: new Vec2(rgbColors[1]) },
                uColor3: { value: new Vec2(rgbColors[2]) },
                uSpeed: { value: speed },
                uDistortion: { value: distortion }
            }
        });

        // Fix OGL uniforms for colors
        program.uniforms.uColor1.value = rgbColors[0];
        program.uniforms.uColor2.value = rgbColors[1];
        program.uniforms.uColor3.value = rgbColors[2];

        const mesh = new Mesh(gl, { geometry, program });

        let animationId;
        const update = (t) => {
            animationId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        };
        animationId = requestAnimationFrame(update);

        const handleResize = () => {
            renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
            program.uniforms.uResolution.value.set(
                canvas.parentElement.offsetWidth,
                canvas.parentElement.offsetHeight
            );
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [colors, speed, distortion]);

    return <canvas ref={canvasRef} className={`color-bends-canvas ${className}`} />;
};

export default ColorBends;
