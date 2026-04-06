import { useEffect, useRef, useCallback, useState } from 'react';

const SOUND_URLS = {
  cursor: '/sounds/cursor.mp3',
  confirm: '/sounds/confirm.mp3',
  cancel: '/sounds/cancel.mp3',
  opening: '/sounds/opening.mp3',
  start: '/sounds/start.mp3',
};

const VOLUME_STEP = 0.1;

export function useSounds() {
  const soundsRef = useRef({});
  const [volume, setVolumeState] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const volumeRef = useRef(1.0);
  const mutedRef = useRef(false);

  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      soundsRef.current[name] = audio;
    });
  }, []);

  const playSound = useCallback((name) => {
    if (mutedRef.current) return;
    const sound = soundsRef.current[name];
    if (sound) {
      sound.volume = volumeRef.current;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }, []);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    volumeRef.current = clamped;
    setVolumeState(clamped);
  }, []);

  const volumeUp = useCallback(() => {
    setVolume(Math.round((volumeRef.current + VOLUME_STEP) * 10) / 10);
  }, [setVolume]);

  const volumeDown = useCallback(() => {
    setVolume(Math.round((volumeRef.current - VOLUME_STEP) * 10) / 10);
  }, [setVolume]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  return { playSound, volume, setVolume, volumeUp, volumeDown, muted, toggleMute };
}
