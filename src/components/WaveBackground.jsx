import { useRef, useEffect } from 'react';
import '../styles/WaveBackground.css';

export function WaveBackground({ surge }) {
  const canvasRef = useRef(null);
  const tRef = useRef(0);
  const frameRef = useRef(null);
  const speedRef = useRef(1);
  const surgeRef = useRef(surge);

  useEffect(() => {
    surgeRef.current = surge;
  }, [surge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    function waveY(x, w, phase, amplitude, freq) {
      const nx = x / w;
      return Math.sin(nx * freq + phase) * amplitude
        + Math.sin(nx * freq * 0.5 + phase * 1.2) * amplitude * 0.5
        + Math.sin(nx * freq * 0.3 + phase * 0.6) * amplitude * 0.3;
    }

    function drawWave(phase, yBase, amplitude, freq, color, alpha) {
      const w = canvas.width, h = canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x++) {
        ctx.lineTo(x, yBase + waveY(x, w, phase, amplitude, freq));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }

    function frame() {
      frameRef.current = requestAnimationFrame(frame);

      const target = surgeRef.current ? 40 : 1;
      const lerp = surgeRef.current ? 0.18 : 0.03;
      speedRef.current += (target - speedRef.current) * lerp;
      tRef.current += 0.002 * speedRef.current;

      const w = canvas.width, h = canvas.height;

      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0e2a');
      bgGrad.addColorStop(1, '#0d1b3e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const yBase = h * 0.55;
      const amp = h * 0.15;

      drawWave(tRef.current * 0.8, yBase, amp, 2.0, '#1a3a6e', 0.5);
      drawWave(tRef.current + 1.5, yBase + amp * 0.4, amp * 0.8, 1.8, '#102850', 0.6);
    }

    resize();
    frameRef.current = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="wave-bg" />;
}
