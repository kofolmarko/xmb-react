import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { themes, themeOrder, getTheme } from '../themes';

export { themes, themeOrder };

const ThemeContext = createContext(null);

const STORAGE_KEY = 'xmb-theme';

function applyThemeCSS(theme) {
  const root = document.documentElement;
  const css = theme.css;
  for (const [key, value] of Object.entries(css)) {
    root.style.setProperty(key, value);
  }
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && themes[stored]) return stored;
    } catch { /* ignore */ }
    return 'midnight';
  });

  const [previewId, setPreviewId] = useState(null);
  const isPreviewing = previewId !== null;
  const activeTheme = getTheme(isPreviewing ? previewId : themeId);
  const savedThemeRef = useRef(themeId);

  useEffect(() => {
    applyThemeCSS(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    if (!isPreviewing) {
      try {
        localStorage.setItem(STORAGE_KEY, themeId);
      } catch { /* ignore */ }
    }
  }, [themeId, isPreviewing]);

  const cycleTheme = useCallback(() => {
    setThemeId(prev => {
      const idx = themeOrder.indexOf(prev);
      return themeOrder[(idx + 1) % themeOrder.length];
    });
  }, []);

  const setTheme = useCallback((id) => {
    if (themes[id]) {
      setPreviewId(null);
      setThemeId(id);
    }
  }, []);

  const previewTheme = useCallback((id) => {
    if (themes[id]) {
      setPreviewId(id);
      applyThemeCSS(getTheme(id));
    }
  }, []);

  const commitPreview = useCallback(() => {
    if (previewId) {
      setThemeId(previewId);
      setPreviewId(null);
    }
  }, [previewId]);

  const revertPreview = useCallback(() => {
    setPreviewId(null);
    applyThemeCSS(getTheme(themeId));
  }, [themeId]);

  const openThemePicker = useCallback(() => {
    savedThemeRef.current = themeId;
  }, [themeId]);

  const value = {
    themeId,
    theme: activeTheme,
    cycleTheme,
    setTheme,
    themeOrder,
    previewTheme,
    commitPreview,
    revertPreview,
    openThemePicker,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
