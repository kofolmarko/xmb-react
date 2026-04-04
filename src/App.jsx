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
import { BootScreen } from './components/BootScreen';
import './App.css';

const SWIPE_THRESHOLD = 50;
const TAP_THRESHOLD = 10;

function XMBShell({ playSound, menuVisible }) {
  const {
    state,
    navigateCategory,
    navigateItem,
    activate,
    back,
    openSidePanel,
    navigateSidePanel,
    executeSidePanelAction,
    navigateQuitDialog,
    executeQuitDialog,
    getCurrentItem,
    hideQuitDialog,
  } = useXMB();

  const touchStartRef = useRef(null);
  const touchStartTimeRef = useRef(0);

  const handleKeyDown = useCallback((e) => {
    // Ignore repeated keydown events when holding a key
    if (e.repeat) return;

    if (state.showQuitDialog) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateQuitDialog(e.key === 'ArrowRight' ? 1 : -1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeQuitDialog();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        hideQuitDialog();
      }
      return;
    }
    if (state.showSidePanel) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSidePanel(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateSidePanel(1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSidePanelAction();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        back();
      }
      return;
    }
    if (state.showMedia) {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        back();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (state.subMenuOpen) {
          back(); // Close submenu
        } else {
          navigateCategory(-1);
        }
        break;
      case 'ArrowRight': e.preventDefault(); navigateCategory(1);  break;
      case 'ArrowUp':    e.preventDefault(); navigateItem(-1);     break;
      case 'ArrowDown':  e.preventDefault(); navigateItem(1);      break;
      case 'Enter':      e.preventDefault(); activate();           break;
      case 'Escape':
      case 'Backspace':  e.preventDefault(); back();               break;
      case 't':
      case 'T': {
        e.preventDefault();
        const item = getCurrentItem(state);
        if (item) openSidePanel('actions', item);
        break;
      }
      default: break;
    }
  }, [state, navigateCategory, navigateItem, activate, back, openSidePanel, navigateSidePanel, executeSidePanelAction, navigateQuitDialog, executeQuitDialog, hideQuitDialog, getCurrentItem]);

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

    // Handle taps/clicks in overlays
    if (state.showQuitDialog) {
      if (isTap) hideQuitDialog();
    } else if (state.showMedia || state.showSidePanel) {
      if (isTap && touch.clientX > 100) back();
    } else if (state.subMenuOpen) {
      // When submenu is open, swipe left or tap to close
      if (!isTap && distanceMoved > SWIPE_THRESHOLD) {
        if (Math.abs(dx) > Math.abs(dy) && dx < 0) {
          // Swipe left = close submenu
          back();
        } else if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical swipe in submenu: dy > 0 = swipe down = previous item
          navigateItem(dy > 0 ? -1 : 1);
        }
      }
    } else if (!isTap && distanceMoved > SWIPE_THRESHOLD) {
      // Only handle swipe gestures here; let ItemRow onClick handle taps
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe: dx > 0 = swipe right = go to previous category
        navigateCategory(dx > 0 ? -1 : 1);
      } else {
        // Vertical swipe: dy > 0 = swipe down = go to previous item
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

  return (
    <div className="app">
      <WaveBackground />
      <SplashBackground splashArt={splashArt} />
      {menuVisible && <StatusBar />}

      <div
        className="xmb-container"
        style={{ opacity: menuVisible ? 1 : 0, transition: 'opacity 800ms ease 400ms' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CategoryRow currentCategory={state.currentCategory} subMenuOpen={state.subMenuOpen} />
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
    </div>
  );
}

export default function App() {
  const playSound = useSounds();
  const [booting, setBooting] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <XMBProvider playSound={playSound}>
        <XMBShell playSound={playSound} menuVisible={menuVisible} />
      </XMBProvider>
      {booting && (
        <BootScreen
          onDone={() => {
            setMenuVisible(true);
            setTimeout(() => setBooting(false), 1500);
          }}
          playSound={playSound}
        />
      )}
    </>
  );
}
