import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import './Plasma.css';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
  
  float v = 0.0;
  v += sin((uv.x + uTime));
  v += sin((uv.y + uTime) / 2.0);
  v += sin((uv.x + uv.y + uTime) / 2.0);
  
  vec2 c = uv + vec2(sin(uTime / 3.0), cos(uTime / 2.0));
  v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + uTime);
  v = v / 2.0;
  
  vec3 col = vec3(
    sin(v * 3.14159),
    sin(v * 3.14159 + 2.0 * 3.14159 / 3.0),
    sin(v * 3.14159 + 4.0 * 3.14159 / 3.0)
  ) * 0.5 + 0.5;
  
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Plasma() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: false });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 1);
        containerRef.current.appendChild(gl.canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, 1) }
            }
        });

        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            if (!containerRef.current) return;
            renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
            program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, 1);
        }
        window.addEventListener('resize', resize);
        resize();

        let rafId;
        const update = (t) => {
            rafId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        };
        rafId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            if (containerRef.current && gl.canvas.parentElement === containerRef.current) {
                containerRef.current.removeChild(gl.canvas);
            }
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []);

    return <div ref={containerRef} className="plasma-container" />;
}
