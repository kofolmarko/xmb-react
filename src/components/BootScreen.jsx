import { useRef, useEffect, useCallback, useState } from 'react';
import { boot } from '../manifest';
import '../styles/BootScreen.css';

export function BootScreen({ onDone, onExiting, playSound }) {
  const doneRef = useRef(false);
  const opacityRef = useRef(0);
  const phaseRef = useRef('fadeIn');
  const transitionRef = useRef(false);
  const transitionStartRef = useRef(0);
  const animRef = useRef(null);

  const [transitionStyle, setTransitionStyle] = useState({ opacity: 0 });

  const handleDone = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    transitionRef.current = true;
    transitionStartRef.current = performance.now();
    playSound('opening');
    onExiting?.();
  }, [playSound, onExiting]);

  useEffect(() => {
    let running = true;

    const tick = (now) => {
      if (!running) return;

      if (phaseRef.current === 'fadeIn' && !transitionRef.current) {
        opacityRef.current = Math.min(1, opacityRef.current + 0.015);
        if (opacityRef.current >= 1) phaseRef.current = 'idle';
        setTransitionStyle({ opacity: opacityRef.current });
      }

      if (transitionRef.current) {
        const elapsed = now - transitionStartRef.current;
        const progress = Math.min(1, elapsed / 1500);
        const ease = progress * progress;
        setTransitionStyle({
          opacity: 1 - ease,
          transform: `scale(${1 + ease * 0.3})`,
          filter: `blur(${ease * 12}px)`,
        });
        if (progress >= 1) {
          running = false;
          onDone();
          return;
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    const handler = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDone();
      }
    };
    window.addEventListener('keydown', handler);

    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', handler);
    };
  }, [handleDone, onDone]);

  return (
    <div className="boot-screen" onClick={handleDone}>
      <div className="boot-content" style={transitionStyle}>
        <h1 className="boot-title">{boot.text}</h1>
        <p className="boot-subtitle">{boot.subText}</p>
      </div>
    </div>
  );
}
