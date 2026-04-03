import { useEffect, useRef, useCallback } from 'react';

const SOUND_URLS = {
  cursor: '/sounds/cursor.mp3',
  confirm: '/sounds/confirm.mp3',
  cancel: '/sounds/cancel.mp3',
  opening: '/sounds/opening.mp3',
  start: '/sounds/start.mp3',
};

export function useSounds() {
  const soundsRef = useRef({});

  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      soundsRef.current[name] = audio;
    });
  }, []);

  const playSound = useCallback((name) => {
    const sound = soundsRef.current[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }, []);

  return playSound;
}
