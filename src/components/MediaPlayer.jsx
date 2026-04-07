import { useRef, useEffect, useState, useCallback } from 'react';
import { Home } from 'lucide-react';
import '../styles/MediaPlayer.css';

function formatTime(s) {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function buildPlaylist(item) {
  if (item.action?.playlist?.length) return item.action.playlist;
  return [{
    title: item.label,
    artist: item.action?.artist || null,
    src: item.action?.src,
    thumbnail: item.thumbnail || item.splashArt || null,
  }];
}

function AudioPlayer({ item, volume, muted, keysEnabled }) {
  const audioRef      = useRef(null);
  const canvasRef     = useRef(null);
  const audioCtxRef   = useRef(null);
  const analyserRef   = useRef(null);
  const setupDoneRef  = useRef(false);
  const scrubberRef   = useRef(null);
  const isDraggingRef = useRef(false);

  // Hold-to-seek refs
  const holdTimerRef  = useRef(null);
  const seekTimerRef  = useRef(null);
  const isHoldingRef  = useRef(false);

  const playlist = buildPlaylist(item);
  const total = playlist.length;

  const [trackIndex, setTrackIndex] = useState(item.startIndex ?? 0);
  const [playing, setPlaying]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);

  const track    = playlist[trackIndex];
  const progress = duration > 0 ? currentTime / duration : 0;

  // ── Volume sync ────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // ── Track change: reload + play ────────────────────────────────────
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [trackIndex]);

  // ── Web Audio (lazy, once) ─────────────────────────────────────────
  const setupAudio = useCallback(() => {
    if (setupDoneRef.current || !audioRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.92;
      analyserRef.current = analyser;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      setupDoneRef.current = true;
    } catch (_) {}
  }, []);

  // ── Visualizer loop (StrictMode-safe) ─────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let alive = true;
    let id;

    const draw = () => {
      if (!alive) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (analyserRef.current && setupDoneRef.current) {
        const bufLen = analyserRef.current.frequencyBinCount;
        const data   = new Uint8Array(bufLen);
        analyserRef.current.getByteFrequencyData(data);

        // Only use lower ~60% of bins — high freqs are too jittery
        const useLen = Math.floor(bufLen * 0.6);
        const step   = w / (useLen - 1);

        // Build smooth points
        const xs = new Float32Array(useLen);
        const ys = new Float32Array(useLen);
        for (let i = 0; i < useLen; i++) {
          xs[i] = i * step;
          ys[i] = h - (data[i] / 255) * h * 0.8;
        }

        // Filled area under the curve
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(xs[0], ys[0]);
        for (let i = 0; i < useLen - 1; i++) {
          const mx = (xs[i] + xs[i + 1]) / 2;
          const my = (ys[i] + ys[i + 1]) / 2;
          ctx.quadraticCurveTo(xs[i], ys[i], mx, my);
        }
        ctx.lineTo(xs[useLen - 1], ys[useLen - 1]);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();

        // Top edge line
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let i = 0; i < useLen - 1; i++) {
          const mx = (xs[i] + xs[i + 1]) / 2;
          const my = (ys[i] + ys[i + 1]) / 2;
          ctx.quadraticCurveTo(xs[i], ys[i], mx, my);
        }
        ctx.lineTo(xs[useLen - 1], ys[useLen - 1]);
        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.shadowBlur  = 0;
        ctx.stroke();
      }

      id = requestAnimationFrame(draw);
    };

    id = requestAnimationFrame(draw);
    return () => { alive = false; cancelAnimationFrame(id); ro.disconnect(); };
  }, []);

  useEffect(() => () => audioCtxRef.current?.close(), []);

  // ── Playback ───────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    setupAudio();
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    setPlaying(true);
  }, [setupAudio]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
  }, []);

  // ── Infinite track navigation ──────────────────────────────────────
  const goTo = useCallback((idx) => {
    setTrackIndex(((idx % total) + total) % total);
  }, [total]);

  const handleEnded = useCallback(() => goTo(trackIndex + 1), [trackIndex, goTo]);

  // ── Seekbar drag ───────────────────────────────────────────────────
  const seekRatio = useCallback((clientX) => {
    if (!scrubberRef.current) return;
    const dur = audioRef.current?.duration;
    if (!dur) return;
    const rect  = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * dur;
    setCurrentTime(ratio * dur);
  }, []);

  const onScrubDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    scrubberRef.current.setPointerCapture(e.pointerId);
    seekRatio(e.clientX);
  };
  const onScrubMove = (e) => { if (isDraggingRef.current) seekRatio(e.clientX); };
  const onScrubUp   = ()  => { isDraggingRef.current = false; };

  // ── Keyboard: tap = track change, hold = seek ──────────────────────
  useEffect(() => {
    const clearHold = () => {
      clearTimeout(holdTimerRef.current);
      clearInterval(seekTimerRef.current);
      holdTimerRef.current = null;
      seekTimerRef.current = null;
    };

    const onKeyDown = (e) => {
      if (!keysEnabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) togglePlay();
        return;
      }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      if (e.repeat || holdTimerRef.current || seekTimerRef.current) return;

      const dir = e.key === 'ArrowRight' ? 1 : -1;
      isHoldingRef.current = false;

      // After 300ms hold, start seeking at 3s per tick
      holdTimerRef.current = setTimeout(() => {
        isHoldingRef.current = true;
        seekTimerRef.current = setInterval(() => {
          if (!audioRef.current) return;
          const next = Math.max(0, Math.min(
            audioRef.current.duration || 0,
            audioRef.current.currentTime + dir * 3
          ));
          audioRef.current.currentTime = next;
          setCurrentTime(next);
        }, 80);
      }, 300);
    };

    const onKeyUp = (e) => {
      if (!keysEnabled) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const wasHolding = isHoldingRef.current;
      clearHold();
      isHoldingRef.current = false;
      // Short tap: change track
      if (!wasHolding) {
        goTo(trackIndex + (e.key === 'ArrowRight' ? 1 : -1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      clearHold();
    };
  }, [trackIndex, goTo, togglePlay, keysEnabled]);

  return (
    <div className="audio-player-psp">

      {/* Header */}
      <div className="audio-header">
        <span className="audio-header-title">{item.loadingLabel ?? item.label}</span>
        <span className="audio-header-count">{trackIndex + 1}&thinsp;/&thinsp;{total}</span>
      </div>

      {/* Centered content */}
      <div className="audio-center">

        {track.thumbnail ? (
          <div className="audio-art"><img src={track.thumbnail} alt="" draggable={false} /></div>
        ) : (
          <div className="audio-art audio-art--placeholder"><item.icon size={40} /></div>
        )}

        <div className="audio-info">
          <div className="audio-track-name">{track.title}</div>
          {track.artist && <div className="audio-artist">{track.artist}</div>}
        </div>

        <canvas ref={canvasRef} className="audio-visualizer" />

        {/* Controls: transport + seekbar + time in one row */}
        <div className="audio-controls">
          <button className="audio-btn audio-btn--skip" onClick={() => goTo(trackIndex - 1)} tabIndex={-1}>◀</button>
          <button className="audio-btn audio-btn--play" onClick={togglePlay} tabIndex={-1}>
            {playing ? '⏸' : '▶'}
          </button>
          <button className="audio-btn audio-btn--skip" onClick={() => goTo(trackIndex + 1)} tabIndex={-1}>▶</button>

          <div
            ref={scrubberRef}
            className="audio-scrubber"
            onPointerDown={onScrubDown}
            onPointerMove={onScrubMove}
            onPointerUp={onScrubUp}
          >
            <div className="audio-scrubber-fill" style={{ width: `${progress * 100}%` }} />
            <div className="audio-scrubber-handle" style={{ left: `${progress * 100}%` }} />
          </div>

          <span className="audio-time">
            {formatTime(currentTime)}<span className="audio-time-sep"> / </span>{formatTime(duration)}
          </span>
        </div>

      </div>

      <audio
        ref={audioRef}
        autoPlay
        onPlay={handlePlay}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.target.duration);
          if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
        }}
      >
        <source src={track.src} />
      </audio>
    </div>
  );
}

function buildVideoPlaylist(item) {
  if (item.action?.playlist?.length) return item.action.playlist;
  return [{ title: item.label, src: item.action?.src, thumbnail: item.thumbnail || item.splashArt || null }];
}

function VideoPlayer({ item, onQuit, volume, muted, keysEnabled }) {
  const videoRef      = useRef(null);
  const scrubberRef   = useRef(null);
  const isDraggingRef = useRef(false);
  const overlayTimer  = useRef(null);
  const holdTimerRef  = useRef(null);
  const seekTimerRef  = useRef(null);
  const isHoldingRef  = useRef(false);

  const playlist = buildVideoPlaylist(item);
  const total    = playlist.length;

  const [trackIndex, setTrackIndex]   = useState(item.startIndex ?? 0);
  const [playing, setPlaying]         = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [overlayVisible, setOverlay]  = useState(true);
  const [ended, setEnded]             = useState(false);
  const [menuIndex, setMenuIndex]     = useState(0);
  const endedRef                      = useRef(false);

  const track    = playlist[trackIndex];
  const progress = duration > 0 ? currentTime / duration : 0;

  // Keep ref in sync for keyboard handler
  useEffect(() => { endedRef.current = ended; }, [ended]);

  // Track change: reload + play
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [trackIndex]);

  const showOverlay = useCallback(() => {
    setOverlay(true);
    clearTimeout(overlayTimer.current);
    overlayTimer.current = setTimeout(() => setOverlay(false), 2500);
  }, []);

  useEffect(() => {
    showOverlay();
    return () => clearTimeout(overlayTimer.current);
  }, [showOverlay]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const goTo = useCallback((idx) => {
    setTrackIndex(((idx % total) + total) % total);
    setEnded(false);
    endedRef.current = false;
    setMenuIndex(0);
  }, [total]);

  const replay = useCallback(() => {
    if (!videoRef.current) return;
    setEnded(false);
    endedRef.current = false;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    showOverlay();
  }, [showOverlay]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
  }, []);

  const seekRatio = useCallback((clientX) => {
    if (!scrubberRef.current || !videoRef.current) return;
    const dur = videoRef.current.duration;
    if (!dur) return;
    const rect  = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * dur;
    setCurrentTime(ratio * dur);
  }, []);

  const onScrubDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    scrubberRef.current.setPointerCapture(e.pointerId);
    seekRatio(e.clientX);
  };
  const onScrubMove = (e) => { if (isDraggingRef.current) seekRatio(e.clientX); };
  const onScrubUp   = ()  => { isDraggingRef.current = false; };

  useEffect(() => {
    const clearHold = () => {
      clearTimeout(holdTimerRef.current);
      clearInterval(seekTimerRef.current);
      holdTimerRef.current = null;
      seekTimerRef.current = null;
    };

    const onKeyDown = (e) => {
      if (!keysEnabled) return;
      if (endedRef.current) {
        const optCount = total > 1 ? 3 : 2;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setMenuIndex(i => (i - 1 + optCount) % optCount);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setMenuIndex(i => (i + 1) % optCount);
        } else if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          setMenuIndex(i => {
            if (i === 0) replay();
            else if (i === 1 && total > 1) goTo(trackIndex + 1);
            else onQuit();
            return i;
          });
        }
        return;
      }
      showOverlay();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) togglePlay();
        return;
      }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      if (e.repeat || holdTimerRef.current || seekTimerRef.current) return;

      const dir = e.key === 'ArrowRight' ? 1 : -1;
      isHoldingRef.current = false;

      holdTimerRef.current = setTimeout(() => {
        isHoldingRef.current = true;
        seekTimerRef.current = setInterval(() => {
          if (!videoRef.current) return;
          const next = Math.max(0, Math.min(
            videoRef.current.duration || 0,
            videoRef.current.currentTime + dir * 3
          ));
          videoRef.current.currentTime = next;
          setCurrentTime(next);
        }, 80);
      }, 300);
    };

    const onKeyUpVideo = (e) => {
      if (!keysEnabled) return;
      if (endedRef.current) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const wasHolding = isHoldingRef.current;
      clearHold();
      isHoldingRef.current = false;
      if (!wasHolding && videoRef.current) {
        const dir  = e.key === 'ArrowRight' ? 1 : -1;
        const next = Math.max(0, Math.min(
          videoRef.current.duration || 0,
          videoRef.current.currentTime + dir * 10
        ));
        videoRef.current.currentTime = next;
        setCurrentTime(next);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUpVideo);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUpVideo);
      clearHold();
    };
  }, [keysEnabled, togglePlay, showOverlay, replay, goTo, trackIndex, total, onQuit]);

  return (
    <div className="video-player-psp" onMouseMove={ended ? undefined : showOverlay}>
      <video
        ref={videoRef}
        autoPlay
        poster={track.thumbnail || undefined}
        className="fullscreen-video"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setEnded(true); setMenuIndex(0); setPlaying(false); clearTimeout(overlayTimer.current); setOverlay(false); }}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.target.duration);
          if (videoRef.current) videoRef.current.volume = muted ? 0 : volume;
        }}
      >
        <source src={track.src} type="video/mp4" />
      </video>

      {ended && (
        <div className="video-end-screen">
          <div className="video-end-options">
            {[
              { label: 'Replay', action: replay },
              ...(total > 1 ? [{ label: 'Next', action: () => goTo(trackIndex + 1) }] : []),
              { label: 'Exit', action: onQuit },
            ].map(({ label, action }, i) => (
              <button
                key={label}
                className={`video-end-option${menuIndex === i ? ' selected' : ''}`}
                tabIndex={-1}
                onClick={action}
                onMouseEnter={() => setMenuIndex(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!ended && <div className={`video-overlay${overlayVisible ? ' video-overlay--visible' : ''}`}>

        <div className="video-overlay-top">
          <span className="video-title">{track.title}</span>
          <span className="video-time">
            {formatTime(currentTime)}<span className="audio-time-sep"> / </span>{formatTime(duration)}
          </span>
        </div>

        <div className="video-overlay-bottom">
          <div
            ref={scrubberRef}
            className="audio-scrubber"
            onPointerDown={onScrubDown}
            onPointerMove={onScrubMove}
            onPointerUp={onScrubUp}
          >
            <div className="audio-scrubber-fill"   style={{ width: `${progress * 100}%` }} />
            <div className="audio-scrubber-handle" style={{ left:  `${progress * 100}%` }} />
          </div>

          <div className="video-transport">
            <button
              className="audio-btn audio-btn--skip"
              tabIndex={-1}
              onClick={() => {
                if (!videoRef.current) return;
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
              }}
            >◀</button>
            <button className="audio-btn audio-btn--play" tabIndex={-1} onClick={togglePlay}>
              {playing ? '⏸' : '▶'}
            </button>
            <button
              className="audio-btn audio-btn--skip"
              tabIndex={-1}
              onClick={() => {
                if (!videoRef.current) return;
                videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10);
              }}
            >▶</button>
          </div>
        </div>

      </div>}
    </div>
  );
}

export function MediaPlayer({ item, onQuit, volume, muted, keysEnabled = true }) {
  if (!item) return null;

  if (item.action.contentType === 'audio') {
    return (
      <div className="media-player-fullscreen">
        <AudioPlayer item={item} volume={volume} muted={muted} keysEnabled={keysEnabled} />
      </div>
    );
  }

  if (item.action.contentType === 'video') {
    return (
      <div className="media-player-fullscreen">
        <VideoPlayer item={item} onQuit={onQuit} volume={volume} muted={muted} keysEnabled={keysEnabled} />
      </div>
    );
  }

  return (
    <div className="media-player-fullscreen">
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
        <span className="quit-button-label">Quit</span>
      </button>
    </div>
  );
}
