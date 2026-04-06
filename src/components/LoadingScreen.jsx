import { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

const SOUND_DURATION = 2600;
const HOLD_AFTER_SOUND = 400;
const FADE_TO_BLACK = 500;

const TOTAL_DISPLAY = SOUND_DURATION + HOLD_AFTER_SOUND; // 3000ms

export function LoadingScreen({ onComplete, item }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, FADE_TO_BLACK);
    }, TOTAL_DISPLAY);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      {!exiting && (
        <div className="loading-title-wrap">
          <div className="loading-item-label">{item?.label ?? ''}</div>
          <div className="loading-item-sub">Now Loading</div>
        </div>
      )}
      {exiting && <div className="loading-blackout" />}
    </div>
  );
}
