import { useState, useEffect, useCallback, useRef } from 'react';
import { useXMB } from '../context/XMBContext';
import { OverlayHeader } from './OverlayHeader';
import '../styles/DownloadPanel.css';

export function DownloadPanel({ playSound }) {
  const { state, back } = useXMB();
  const item = state.activeItem;
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [selectedAction, setSelectedAction] = useState(0);
  const downloadLinkRef = useRef(null);

  const filename = item?.action?.filename || 'file.bin';
  const filesize = item?.action?.filesize || '0 MB';
  const url = item?.action?.url || '';

  const handleClose = useCallback(() => {
    playSound('cancel');
    back();
  }, [playSound, back]);

  const handleDownload = useCallback(() => {
    if (downloadStatus === 'downloading') return;
    playSound('confirm');
    setDownloadStatus('downloading');
    setProgress(0);

    const duration = 3000;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDownloadStatus('complete');
        if (downloadLinkRef.current && url) downloadLinkRef.current.click();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [downloadStatus, playSound, url]);

  const getActions = useCallback(() => {
    if (downloadStatus === 'idle') return ['Download', 'Cancel'];
    if (downloadStatus === 'downloading') return ['Cancel'];
    if (downloadStatus === 'complete') return ['Close'];
    return ['Retry', 'Close'];
  }, [downloadStatus]);

  const actions = getActions();

  const handleAction = useCallback(() => {
    const action = actions[selectedAction];
    playSound('confirm');
    if (action === 'Download') handleDownload();
    else if (action === 'Cancel') {
      if (downloadStatus === 'downloading') { setDownloadStatus('idle'); setProgress(0); }
      else handleClose();
    } else if (action === 'Close' || action === 'Retry') {
      action === 'Retry' ? handleDownload() : handleClose();
    }
  }, [actions, selectedAction, downloadStatus, handleDownload, handleClose, playSound]);

  useEffect(() => { setSelectedAction(0); }, [downloadStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); handleClose(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); playSound('cursor'); setSelectedAction((p) => Math.max(0, p - 1)); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); playSound('cursor'); setSelectedAction((p) => Math.min(actions.length - 1, p + 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); handleAction(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, handleAction, actions.length, playSound]);

  if (!item) return null;

  const ItemIcon = item.icon;

  return (
    <div className="download-panel-overlay">
      <OverlayHeader icon={ItemIcon} title={item.label} />

      <a ref={downloadLinkRef} href={url} download={filename} style={{ display: 'none' }} />

      <div className="download-panel">
        <div className="download-title">{filename}</div>
        <div className="download-size">{filesize}</div>

        <div className="download-body">
          {downloadStatus === 'downloading' && (
            <>
              <div className="download-progress-bar">
                <div className="download-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="download-progress-text">{progress.toFixed(0)}%</div>
            </>
          )}
          {downloadStatus === 'complete' && <p className="download-message">Download complete</p>}
          {downloadStatus === 'error' && <p className="download-message">Download failed</p>}
        </div>

        <div className="download-actions">
          {actions.map((action, idx) => (
            <div
              key={action}
              className={`download-action ${idx === selectedAction ? 'selected' : ''}`}
              onClick={() => { setSelectedAction(idx); setTimeout(() => handleAction(), 100); }}
            >
              {action}
            </div>
          ))}
        </div>
      </div>
      <div className="overlay-hint">
        <span>✕ Confirm</span>
        <span>◯ Back</span>
      </div>
    </div>
  );
}
