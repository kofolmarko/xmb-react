import { Play, Globe, Info } from 'lucide-react';
import { useXMB } from '../context/XMBContext';
import '../styles/SidePanel.css';

export function SidePanel({ playSound }) {
  const { state, closeSidePanel, openSidePanel, openMedia, getContextOptions } = useXMB();
  const { activeItem, sidePanelMode, sidePanelActionIndex } = state;

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
    if (activeItem?.action?.src) {
      window.open(activeItem.action.src, '_blank');
    }
    handleClose();
  };

  const handlePlay = () => {
    playSound('start');
    openMedia(activeItem);
  };

  if (sidePanelMode === 'actions') {
    const options = getContextOptions(activeItem);
    return (
      <div className="side-panel-overlay" onClick={handleOverlayClick}>
        <div className="side-panel" onClick={(e) => e.stopPropagation()}>
          <div className="side-panel-title">{activeItem.label}</div>
          <div className="side-panel-actions">
            {options.map((opt, idx) => {
              const OptIcon = opt.id === 'play' ? Play : opt.id === 'new-tab' ? Globe : Info;
              return (
                <button
                  key={opt.id}
                  className={`side-panel-action-btn ${sidePanelActionIndex === idx ? 'selected' : ''}`}
                  onClick={() => {
                    if (opt.id === 'play') handlePlay();
                    else if (opt.id === 'new-tab') handleOpenInNewTab();
                    else if (opt.id === 'info') {
                      closeSidePanel();
                      setTimeout(() => {
                        openSidePanel('info', activeItem);
                      }, 0);
                    }
                  }}
                >
                  <span className="action-cursor">▶</span>
                  <OptIcon size={16} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="side-panel-overlay" onClick={handleOverlayClick}>
      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
        <div className="side-panel-icon">
          <activeItem.icon size={64} />
        </div>
        <h2 className="side-panel-title">{activeItem.label}</h2>
        {activeItem.action?.description && (
          <p className="side-panel-description">{activeItem.action.description}</p>
        )}
        {activeItem.action?.date && (
          <p className="side-panel-date">{activeItem.action.date}</p>
        )}
        {isMedia && (
          <div className="side-panel-options">
            <button className={`side-panel-option-btn ${sidePanelActionIndex === 0 ? 'selected' : ''}`} onClick={handlePlay}>
              <span className="option-cursor">▶</span>
              <Play size={16} />
              <span>Play</span>
            </button>
            <button className={`side-panel-option-btn ${sidePanelActionIndex === 1 ? 'selected' : ''}`} onClick={handleOpenInNewTab}>
              <span className="option-cursor">▶</span>
              <Globe size={16} />
              <span>Open in New Tab</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
