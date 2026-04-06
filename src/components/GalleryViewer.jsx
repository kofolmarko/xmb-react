import { useState, useEffect, useCallback } from 'react';
import { useXMB } from '../context/XMBContext';
import { OverlayHeader } from './OverlayHeader';
import '../styles/GalleryViewer.css';

export function GalleryViewer({ playSound }) {
  const { state, back } = useXMB();
  const item = state.activeItem;
  const images = item?.action?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = useCallback(() => {
    playSound('cancel');
    back();
  }, [playSound, back]);

  const handlePrevious = useCallback(() => {
    playSound('cursor');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length, playSound]);

  const handleNext = useCallback(() => {
    playSound('cursor');
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length, playSound]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, handlePrevious, handleNext]);

  if (!item || images.length === 0) return null;

  const ItemIcon = item.icon;
  const currentImage = images[currentIndex];

  return (
    <div className="gallery-viewer-overlay">
      <OverlayHeader icon={ItemIcon} title={item.label} />

      <div className="gallery-content">
        <button className="gallery-arrow" onClick={handlePrevious}>◄</button>

        <div className="gallery-image-area">
          <img
            src={currentImage.url}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            className="gallery-image"
          />
          {currentImage.caption && (
            <div className="gallery-caption">{currentImage.caption}</div>
          )}
        </div>

        <button className="gallery-arrow" onClick={handleNext}>►</button>
      </div>

      <div className="gallery-footer">
        <div className="gallery-counter">{currentIndex + 1} / {images.length}</div>
        <div className="overlay-hint" style={{ position: 'static' }}><span>◯ Back</span></div>
      </div>
    </div>
  );
}
