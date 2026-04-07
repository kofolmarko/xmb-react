import { useEffect, useRef } from 'react';
import { Play, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useXMB } from '../context/XMBContext';
import '../styles/SidePanel.css';

function getAutoMeta(item) {
  const action = item?.action;
  if (!action) return [];
  const meta = [];

  if (action.type === 'media') {
    const ct = action.contentType;
    if (ct === 'audio')      meta.push({ label: 'Type', value: 'Audio' });
    else if (ct === 'video') meta.push({ label: 'Type', value: 'Video' });
    else if (ct === 'web')   meta.push({ label: 'Type', value: 'Web App' });
    else if (ct === 'webgl') meta.push({ label: 'Type', value: 'WebGL Game' });

    const src = action.src || action.playlist?.[0]?.src;
    if (src) {
      const ext = src.split('.').pop().toUpperCase();
      if (['MP3', 'MP4', 'OGG', 'WAV', 'WEBM'].includes(ext)) {
        meta.push({ label: 'Format', value: ext });
      }
    }
    if (action.playlist?.length) {
      meta.push({ label: ct === 'audio' ? 'Tracks' : 'Videos', value: String(action.playlist.length) });
    }
  }

  if (action.type === 'gallery') {
    meta.push({ label: 'Type', value: 'Photo Album' });
    if (action.images?.length) {
      meta.push({ label: 'Images', value: String(action.images.length) });
    }
  }

  if (action.type === 'download') {
    meta.push({ label: 'Type', value: 'File' });
    if (action.filename) meta.push({ label: 'Filename', value: action.filename });
    if (action.filesize) meta.push({ label: 'Size',     value: action.filesize });
  }

  return meta;
}

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
          <span><span className="ps-icon">×</span> Enter</span>
          <span><span className="ps-icon">◯</span> Back</span>
        </div>
      </div>
    );
  }

  // Info mode
  const customMeta = activeItem.details || [];
  const autoMeta = getAutoMeta(activeItem);
  const customLabels = new Set(customMeta.map(m => m.label));
  const allMeta = [...customMeta, ...autoMeta.filter(m => !customLabels.has(m.label))];

  return (
    <div className="side-panel-overlay" onClick={handleOverlayClick}>
      <div className="side-panel-inner" onClick={(e) => e.stopPropagation()}>
        <div className="side-panel-title">
          <ItemIcon size={16} />
          <span>{activeItem.label}</span>
        </div>
        <div className="side-panel-info-body" ref={bodyRef}>
          {allMeta.length > 0 && (
            <dl className="side-panel-meta">
              {allMeta.map(({ label, value }) => (
                <div key={label} className="side-panel-meta-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {activeItem.action?.description && (
            <div className="side-panel-description">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {activeItem.action.description}
              </ReactMarkdown>
            </div>
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
          {isMedia && <span><span className="ps-icon">×</span> Select</span>}
          <span><span className="ps-icon">◯</span> Back</span>
        </div>
      </div>
    </div>
  );
}
