import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './LightRays.css';

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
  uniform vec2 uMouse;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uStrength;
  uniform float uFrequency;
  
  // New color uniforms
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    // Subtle mouse interaction
    vec2 mouse = (uMouse / uResolution) - 0.5;
    st -= mouse * 0.2; // Move rays slightly with mouse

    // Ray generation based on polar angle
    float angle = atan(st.y, st.x);
    float radius = length(st);
    
    // Animate angle to rotate rays
    float t = uTime * uSpeed;
    float n = noise(vec2(angle * uFrequency + t, radius * 0.5));
    
    // Ray pattern
    float rays = smoothstep(0.4, 0.6, n * uDensity);
    
    // Falloff from center and edge softening
    float mask = smoothstep(uStrength, 0.0, radius);
    
    // Mix the colors
    // Base mix between Color1 and Color2 based on radius
    vec3 col = mix(uColor1, uColor2, radius * 1.5);
    
    // Add Color3 at the core
    col = mix(col, uColor3, smoothstep(1.0, 0.0, radius * 2.0));
    
    // Apply ray mask to alpha/brightness
    float alpha = rays * mask;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
}

const LightRays = ({
    speed = 0.2, // Slightly slower default for elegance
    density = 1.2,
    strength = 1.0,
    frequency = 4.0,
    colors = ['#4e84ff', '#8740ff', '#ffffff'], // Default pleasing blue-purple gradient
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

        // Process colors
        const rgbColors = colors.map(hexToRgb);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2() },
                uMouse: { value: new Vec2() },
                uSpeed: { value: speed },
                uDensity: { value: density },
                uStrength: { value: strength },
                uFrequency: { value: frequency },
                uColor1: { value: new Vec2(rgbColors[0]) }, // Passing as Vec3/Array but OGL handles it
                uColor2: { value: new Vec2(rgbColors[1]) },
                uColor3: { value: new Vec2(rgbColors[2]) }
            }
        });

        // Fix OGL auto-conversion for arrays to vec3 if passed incorrectly. 
        // Actually OGL uses { value: [...] } for arrays or TypedArrays.
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

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Flip Y for shader coords usually, or keep screen coords
            program.uniforms.uMouse.value.set(x, canvas.height - y);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            // Clean up OGL resources if needed, though usually garbage collected
        };
    }, [speed, density, strength, frequency, colors]);

    return <canvas ref={canvasRef} className={`light-rays-canvas ${className}`} />;
};

export default LightRays;
