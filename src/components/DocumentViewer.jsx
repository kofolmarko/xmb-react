import { useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useXMB } from '../context/XMBContext';
import { OverlayHeader } from './OverlayHeader';
import '../styles/DocumentViewer.css';

export function DocumentViewer({ playSound }) {
  const { state, back } = useXMB();
  const item = state.activeItem;
  const contentRef = useRef(null);

  const handleClose = useCallback(() => {
    playSound('cancel');
    back();
  }, [playSound, back]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        contentRef.current?.scrollBy({ top: 80, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        contentRef.current?.scrollBy({ top: -80, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!item) return null;

  const ItemIcon = item.icon;
  const description = item.action?.description || '';

  return (
    <div className="document-viewer-overlay" onClick={handleClose}>
      <OverlayHeader icon={ItemIcon} title={item.label} />
      <div className="document-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="document-content" ref={contentRef}>
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img {...props} className="document-image" alt={props.alt || ''} />
              ),
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>
      <div className="overlay-hint">
        <span>◯ Back</span>
      </div>
    </div>
  );
}
