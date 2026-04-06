import { useEffect, useRef } from 'react';
import { Play, Globe } from 'lucide-react';
import { useXMB } from '../context/XMBContext';
import '../styles/SidePanel.css';

export function SidePanel({ playSound }) {
  const { state, closeSidePanel, openSidePanel, openMedia, getContextOptions } = useXMB();
  const { activeItem, sidePanelMode, sidePanelActionIndex } = state;

  const bodyRef = useRef(null);

  useEffect(() => {
    if (sidePanelMode !== 'info') return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        bodyRef.current?.scrollBy({ top: 80, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        bodyRef.current?.scrollBy({ top: -80, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidePanelMode]);

  if (!activeItem) return null;

  const handleClose = () => {
    playSound('cancel');
    closeSidePanel();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const isMedia = activeItem?.action?.type === 'media';

  const handleOpenInNewTab = () => {
    if (activeItem?.action?.src) window.open(activeItem.action.src, '_blank');
    handleClose();
  };

  const handlePlay = () => {
    playSound('start');
    openMedia(activeItem);
  };

  const ItemIcon = activeItem.icon;

  if (sidePanelMode === 'actions') {
    const options = getContextOptions(activeItem);
    return (
      <div className="side-panel-overlay" onClick={handleOverlayClick}>
        <div className="side-panel-inner" onClick={(e) => e.stopPropagation()}>
          <div className="side-panel-title">
            <ItemIcon size={16} />
            <span>{activeItem.label}</span>
          </div>
          <div className="side-panel-actions-list">
            {options.map((opt, idx) => (
              <button
                key={opt.id}
                className={`side-panel-action-item ${sidePanelActionIndex === idx ? 'selected' : ''}`}
                onClick={() => {
                  if (opt.id === 'play') handlePlay();
                  else if (opt.id === 'new-tab') handleOpenInNewTab();
                  else if (opt.id === 'info') {
                    closeSidePanel();
                    setTimeout(() => openSidePanel('info', activeItem), 0);
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overlay-hint">
          <span>✕ Enter</span>
          <span>◯ Back</span>
        </div>
      </div>
    );
  }

  // Info mode
  return (
    <div className="side-panel-overlay" onClick={handleOverlayClick}>
      <div className="side-panel-inner" onClick={(e) => e.stopPropagation()}>
        <div className="side-panel-title">
          <ItemIcon size={16} />
          <span>{activeItem.label}</span>
        </div>
        <div className="side-panel-info-body" ref={bodyRef}>
          {activeItem.action?.description && (
            <p className="side-panel-description">{activeItem.action.description}</p>
          )}
          {activeItem.action?.date && (
            <p className="side-panel-date">{activeItem.action.date}</p>
          )}
          {isMedia && (
            <div className="side-panel-media-actions">
              <button
                className={`side-panel-media-btn ${sidePanelActionIndex === 0 ? 'selected' : ''}`}
                onClick={handlePlay}
              >
                <Play size={14} /> Play
              </button>
              <button
                className={`side-panel-media-btn ${sidePanelActionIndex === 1 ? 'selected' : ''}`}
                onClick={handleOpenInNewTab}
              >
                <Globe size={14} /> Open in New Tab
              </button>
            </div>
          )}
        </div>
        <div className="overlay-hint">
          {isMedia && <span>✕ Select</span>}
          <span>◯ Back</span>
        </div>
      </div>
    </div>
  );
}
