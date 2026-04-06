import { useEffect, useCallback, useRef, useState } from 'react';
import { useSounds } from './hooks/useSounds';
import { XMBProvider, useXMB } from './context/XMBContext';
import { StatusBar } from './components/StatusBar';
import { SplashBackground } from './components/SplashBackground';
import { WaveBackground } from './components/WaveBackground';
import { CategoryRow } from './components/CategoryRow';
import { ItemColumn } from './components/ItemColumn';
import { SidePanel } from './components/SidePanel';
import { MediaPlayer } from './components/MediaPlayer';
import { QuitDialog } from './components/QuitDialog';
import { LoadingScreen } from './components/LoadingScreen';
import { DocumentViewer } from './components/DocumentViewer';
import { GalleryViewer } from './components/GalleryViewer';
import { DownloadPanel } from './components/DownloadPanel';
import { BootScreen } from './components/BootScreen';
import { HardwareHUD } from './components/HardwareHUD';
import './App.css';

const SWIPE_THRESHOLD = 50;
const TAP_THRESHOLD = 10;
const BRIGHTNESS_LEVELS = [0.4, 0.7, 1];

function XMBShell({ playSound, menuVisible, bootSurging, onBrightness, onMute, onVolumeUp, onVolumeDown, volume, muted, brightnessIndex }) {
  const {
    state,
    navigateCategory,
    navigateToCategory,
    navigateItem,
    activate,
    back,
    openSidePanel,
    navigateSidePanel,
    executeSidePanelAction,
    navigateQuitDialog,
    executeQuitDialog,
    loadingComplete,
    getCurrentItem,
    hideQuitDialog,
    showQuitDialog,
  } = useXMB();

  const touchStartRef = useRef(null);
  const touchStartTimeRef = useRef(0);

  // Wave surge: only for the duration of the start sound (~2.6s)
  const [launchSurging, setLaunchSurging] = useState(false);
  useEffect(() => {
    if (state.showLoading) {
      playSound('start');
      setLaunchSurging(true);
      const t = setTimeout(() => setLaunchSurging(false), 2600);
      return () => clearTimeout(t);
    }
  }, [state.showLoading, playSound]);

  // PSP button handler — used by both keyboard shortcuts and postMessage
  const handlePSPButton = useCallback((action) => {
    if (!menuVisible) return;

    // Hardware controls work regardless of UI state
    switch (action) {
      case 'brightness': onBrightness(); return;
      case 'mute':       onMute();       return;
      case 'volume_up':  onVolumeUp();   return;
      case 'volume_down': onVolumeDown(); return;
    }

    if (state.showQuitDialog) {
      switch (action) {
        case 'left':   navigateQuitDialog(-1); break;
        case 'right':  navigateQuitDialog(1);  break;
        case 'cross':
        case 'start':  executeQuitDialog();    break;
        case 'circle':
        case 'ps':     hideQuitDialog();       break;
      }
      return;
    }

    if (state.showSidePanel) {
      switch (action) {
        case 'up':     navigateSidePanel(-1); break;
        case 'down':   navigateSidePanel(1);  break;
        case 'cross':
        case 'start': {
          if (state.sidePanelActionIndex === 1 && state.activeItem?.action?.src) {
            window.open(state.activeItem.action.src, '_blank');
          }
          executeSidePanelAction();
          break;
        }
        case 'circle':
        case 'ps':     back(); break;
      }
      return;
    }

    if (state.showGalleryViewer || state.showDownloadPanel) {
      // These components handle their own input internally
      if (action === 'circle' || action === 'ps') back();
      return;
    }

    if (state.showDocumentViewer) {
      if (action === 'circle' || action === 'ps') back();
      return;
    }

    if (state.showMedia) {
      if (action === 'circle' || action === 'ps') back();
      return;
    }

    // Main XMB navigation
    switch (action) {
      case 'up':    navigateItem(-1); break;
      case 'down':  navigateItem(1);  break;
      case 'left':
        if (state.subMenuOpen) back();
        else navigateCategory(-1);
        break;
      case 'right': navigateCategory(1); break;
      case 'cross':
      case 'start': activate(); break;
      case 'circle': back(); break;
      case 'triangle': {
        const item = getCurrentItem(state);
        if (item && item.type !== 'document') {
          const mode = item.action?.type === 'media' ? 'actions' : 'info';
          openSidePanel(mode, item);
        }
        break;
      }
      case 'square': {
        const item = getCurrentItem(state);
        if (item && item.action?.type === 'media') {
          openSidePanel('actions', item);
        } else if (item && item.type !== 'document') {
          openSidePanel('info', item);
        }
        break;
      }
      case 'select': navigateToCategory(0); break;
      case 'ps':
        showQuitDialog();
        break;
    }
  }, [menuVisible, state, navigateCategory, navigateToCategory, navigateItem,
      activate, back, openSidePanel, navigateSidePanel, executeSidePanelAction,
      navigateQuitDialog, executeQuitDialog, hideQuitDialog, showQuitDialog,
      getCurrentItem, onBrightness, onMute, onVolumeUp, onVolumeDown]);

  // postMessage listener for PSP button events from parent iframe
  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === 'psp_button' && typeof e.data.action === 'string') {
        handlePSPButton(e.data.action);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [handlePSPButton]);

  const handleKeyDown = useCallback((e) => {
    if (e.repeat) return;
    if (!menuVisible) return;

    switch (e.key) {
      case 'ArrowLeft':   e.preventDefault(); handlePSPButton('left');        break;
      case 'ArrowRight':  e.preventDefault(); handlePSPButton('right');       break;
      case 'ArrowUp':     e.preventDefault(); handlePSPButton('up');          break;
      case 'ArrowDown':   e.preventDefault(); handlePSPButton('down');        break;
      case 'Enter':       e.preventDefault(); handlePSPButton('cross');       break;
      case 'Escape':
      case 'Backspace':   e.preventDefault(); handlePSPButton('circle');      break;
      case 'Home':        e.preventDefault(); handlePSPButton('ps');          break;
      case 't': case 'T': e.preventDefault(); handlePSPButton('triangle');    break;
      case 's': case 'S': e.preventDefault(); handlePSPButton('square');      break;
      case 'p': case 'P': e.preventDefault(); handlePSPButton('ps');          break;
      case 'Tab':         e.preventDefault(); handlePSPButton('select');      break;
      case 'b': case 'B': e.preventDefault(); handlePSPButton('brightness'); break;
      case 'm': case 'M': e.preventDefault(); handlePSPButton('mute');        break;
      case '+': case '=': e.preventDefault(); handlePSPButton('volume_up');   break;
      case '-': case '_': e.preventDefault(); handlePSPButton('volume_down'); break;
    }
  }, [menuVisible, handlePSPButton]);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartTimeRef.current = Date.now();
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const touchDuration = Date.now() - touchStartTimeRef.current;
    const distanceMoved = Math.sqrt(dx * dx + dy * dy);
    const isTap = distanceMoved < TAP_THRESHOLD && touchDuration < 300;

    if (state.showQuitDialog) {
      if (isTap) hideQuitDialog();
    } else if (state.showMedia || state.showSidePanel || state.showDocumentViewer || state.showGalleryViewer || state.showDownloadPanel) {
      if (isTap && touch.clientX > 100) back();
    } else if (state.subMenuOpen) {
      if (!isTap && distanceMoved > SWIPE_THRESHOLD) {
        if (Math.abs(dx) > Math.abs(dy) && dx < 0) {
          back();
        } else if (Math.abs(dy) > Math.abs(dx)) {
          navigateItem(dy > 0 ? -1 : 1);
        }
      }
    } else if (!isTap && distanceMoved > SWIPE_THRESHOLD) {
      if (Math.abs(dx) > Math.abs(dy)) {
        navigateCategory(dx > 0 ? -1 : 1);
      } else {
        navigateItem(dy > 0 ? -1 : 1);
      }
    }
    touchStartRef.current = null;
  }, [state, navigateCategory, navigateItem, back, hideQuitDialog]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const focusedItem = getCurrentItem(state);
  const splashArt = focusedItem?.splashArt ?? null;
  const overlayOpen = state.showSidePanel || state.showDocumentViewer || state.showGalleryViewer ||
    state.showDownloadPanel || state.showLoading || !!state.showMedia;
  const iconsVisible = menuVisible && !(overlayOpen && !state.showLoading);

  const [showDetailsHint, setShowDetailsHint] = useState(false);
  const hintTimerRef = useRef(null);

  useEffect(() => {
    setShowDetailsHint(false);
    clearTimeout(hintTimerRef.current);
    if (focusedItem && focusedItem.type !== 'document' && !overlayOpen && !state.subMenuOpen) {
      hintTimerRef.current = setTimeout(() => setShowDetailsHint(true), 1500);
    }
    return () => clearTimeout(hintTimerRef.current);
  }, [focusedItem?.id, overlayOpen, state.subMenuOpen]);

  return (
    <div className={`app${state.showLoading ? ' launching' : ''}`}>
      <WaveBackground surge={bootSurging || launchSurging} />
      <SplashBackground splashArt={splashArt} hidden={state.showLoading} />
      {menuVisible && !overlayOpen && <StatusBar />}

      <div
        className="xmb-container"
        style={{ opacity: iconsVisible ? 1 : 0, transition: 'opacity 300ms ease', pointerEvents: overlayOpen ? 'none' : 'auto' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CategoryRow currentCategory={state.currentCategory} subMenuOpen={state.subMenuOpen} />
        {showDetailsHint && !state.subMenuOpen && (
          <div className="xmb-hint">△ Details</div>
        )}
        <ItemColumn
          currentCategory={state.currentCategory}
          selectedIndices={state.selectedIndices}
          subMenuOpen={state.subMenuOpen}
          subMenuIndex={state.subMenuIndex}
          isSwitchingCategory={state.isSwitchingCategory}
          onNavigateItem={navigateItem}
          onActivate={activate}
          onBack={back}
        />
      </div>

      {menuVisible && state.showSidePanel && (
        <SidePanel playSound={playSound} />
      )}

      {menuVisible && state.showDocumentViewer && (
        <DocumentViewer playSound={playSound} />
      )}

      {menuVisible && state.showGalleryViewer && (
        <GalleryViewer playSound={playSound} />
      )}

      {menuVisible && state.showDownloadPanel && (
        <DownloadPanel playSound={playSound} />
      )}

      {menuVisible && state.showLoading && (
        <LoadingScreen onComplete={loadingComplete} item={state.loadingItem} />
      )}

      {menuVisible && state.showMedia && (
        <MediaPlayer
          item={state.showMedia}
          onQuit={() => {
            if (state.showMedia) {
              playSound('cancel');
              back();
            }
          }}
        />
      )}

      {menuVisible && state.showQuitDialog && (
        <QuitDialog />
      )}

      <HardwareHUD volume={volume} muted={muted} />
    </div>
  );
}

export default function App() {
  const { playSound, volume, muted, volumeUp, volumeDown, toggleMute } = useSounds();
  const [booting, setBooting] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [bootSurging, setBootSurging] = useState(false);
  const [brightnessIndex, setBrightnessIndex] = useState(2);

  const cycleBrightness = useCallback(() => {
    setBrightnessIndex(i => (i + 1) % BRIGHTNESS_LEVELS.length);
  }, []);

  const brightness = BRIGHTNESS_LEVELS[brightnessIndex];

  return (
    <div style={{ filter: `brightness(${brightness})`, height: '100%', width: '100%' }}>
      <XMBProvider playSound={playSound}>
        <XMBShell
          playSound={playSound}
          menuVisible={menuVisible}
          bootSurging={bootSurging}
          onBrightness={cycleBrightness}
          onMute={toggleMute}
          onVolumeUp={volumeUp}
          onVolumeDown={volumeDown}
          volume={volume}
          muted={muted}
          brightnessIndex={brightnessIndex}
        />
      </XMBProvider>
      {booting && (
        <BootScreen
          onExiting={() => setBootSurging(true)}
          onDone={() => {
            setMenuVisible(true);
            setBootSurging(false);
            setTimeout(() => setBooting(false), 1500);
          }}
          playSound={playSound}
        />
      )}
    </div>
  );
}
