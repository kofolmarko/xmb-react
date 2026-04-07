import { useEffect, useCallback } from 'react';
import { useTheme, themes, themeOrder } from '../context/ThemeContext';
import { useXMB } from '../context/XMBContext';
import '../styles/ThemePicker.css';

export function ThemePicker() {
  const { previewTheme, commitPreview, revertPreview } = useTheme();
  const { state, navigateThemePicker, selectTheme, cancelTheme } = useXMB();

  const currentIndex = state.themePickerIndex;
  const currentId = themeOrder[currentIndex];
  const currentTheme = themes[currentId];

  useEffect(() => {
    previewTheme(currentId);
  }, [currentIndex, currentId, previewTheme]);

  const handlePrev = useCallback(() => {
    navigateThemePicker(-1);
  }, [navigateThemePicker]);

  const handleNext = useCallback(() => {
    navigateThemePicker(1);
  }, [navigateThemePicker]);

  const handleConfirm = useCallback(() => {
    commitPreview();
    selectTheme();
  }, [commitPreview, selectTheme]);

  const handleCancel = useCallback(() => {
    revertPreview();
    cancelTheme();
  }, [revertPreview, cancelTheme]);

  return (
    <div className="theme-picker-overlay">
      <div className="theme-picker-content">
        <button className="theme-picker-arrow" onClick={handlePrev}>◄</button>

        <div className="theme-picker-preview">
          <div className="theme-picker-name">{currentTheme.name}</div>
        </div>

        <button className="theme-picker-arrow" onClick={handleNext}>►</button>
      </div>

      <div className="theme-picker-footer">
        <div className="theme-picker-counter">{currentIndex + 1} / {themeOrder.length}</div>
        <div className="overlay-hint" style={{ position: 'static' }}>
          <span><span className="ps-icon">×</span> Confirm</span>
          <span><span className="ps-icon">◯</span> Back</span>
        </div>
      </div>
    </div>
  );
}
