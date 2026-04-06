import { useRef, useEffect, useState, useCallback } from 'react';
import { Home } from 'lucide-react';
import '../styles/MediaPlayer.css';

function formatTime(s) {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function AudioPlayer({ item, onQuit }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const setupDoneRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const thumbnail = item.thumbnail || item.splashArt || null;
  const artist = item.action?.artist || null;

  const setupAudio = useCallback(() => {
    if (setupDoneRef.current || !audioRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      setupDoneRef.current = true;
    } catch (_) {
      // visualizer won't work but audio will still play
    }
  }, []);

  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (analyserRef.current && setupDoneRef.current) {
      const bufLen = analyserRef.current.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyserRef.current.getByteTimeDomainData(data);

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(0, 210, 195, 0.85)';
      ctx.shadowColor = 'rgba(0, 210, 195, 0.45)';
      ctx.shadowBlur = 10;

      const step = w / bufLen;
      for (let i = 0; i < bufLen; i++) {
        const v = data[i] / 128.0;
        const y = (v * h) / 2;
        i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * step, y);
      }
      ctx.stroke();
    } else {
      // flat idle line
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 210, 195, 0.25)';
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    }

    animFrameRef.current = requestAnimationFrame(drawLoop);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(drawLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [drawLoop]);

  // Keep canvas pixel dimensions in sync with CSS size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sync = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    sync();
    return () => ro.disconnect();
  }, []);

  // Keyboard: Enter/Space = play/pause, ←/→ = seek ±10s
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!audioRef.current) return;
        if (audioRef.current.paused) audioRef.current.play();
        else audioRef.current.pause();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => () => audioCtxRef.current?.close(), []);

  const handlePlay = useCallback(() => {
    setupAudio();
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    setPlaying(true);
  }, [setupAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      setupAudio();
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player-psp">
      {/* Header */}
      <div className="audio-header">
        <span className="audio-header-icon">♫</span>
        <span className="audio-header-title">{item.label}</span>
        <span className="audio-header-badge">MP3</span>
      </div>

      {/* Body */}
      <div className="audio-body">
        {/* Album art */}
        <div className="audio-art">
          {thumbnail ? (
            <img src={thumbnail} alt="" draggable={false} />
          ) : (
            <div className="audio-art-placeholder">
              <item.icon size={36} />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="audio-right">
          <div className="audio-info">
            <div className="audio-track-name">{item.label}</div>
            {artist && <div className="audio-artist">{artist}</div>}
          </div>

          <canvas ref={canvasRef} className="audio-visualizer" />

          {/* Progress bar */}
          <div className="audio-progress" onClick={handleSeek}>
            <div className="audio-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Controls row */}
          <div className="audio-controls">
            <button className="audio-play-btn" onClick={togglePlay} tabIndex={-1}>
              {playing ? '⏸' : '▶'}
            </button>
            <div className="audio-time">
              <span className="audio-time-current">{formatTime(currentTime)}</span>
              <span className="audio-time-sep"> / </span>
              <span className="audio-time-total">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={item.action.src}
        autoPlay
        onPlay={handlePlay}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      />

      <button className="quit-button" onClick={onQuit} tabIndex={-1}>
        <Home size={14} />
      </button>
    </div>
  );
}

export function MediaPlayer({ item, onQuit }) {
  if (!item) return null;

  if (item.action.contentType === 'audio') {
    return (
      <div className="media-player-fullscreen">
        <AudioPlayer item={item} onQuit={onQuit} />
      </div>
    );
  }

  return (
    <div className="media-player-fullscreen">
      {item.action.contentType === 'video' && (
        <video controls autoPlay className="fullscreen-video">
          <source src={item.action.src} type="video/mp4" />
        </video>
      )}
      {(item.action.contentType === 'webgl' || item.action.contentType === 'web') && (
        <iframe
          src={item.action.src}
          title={item.label}
          className="fullscreen-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
        />
      )}
      <button className="quit-button" onClick={onQuit} onMouseEnter={() => window.focus()}>
        <Home size={14} />
      </button>
    </div>
  );
}
