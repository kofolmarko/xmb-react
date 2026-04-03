import { useState, useEffect, useCallback, useRef } from 'react';
import { theme, categories } from './manifest';
import { Battery, Wifi } from 'lucide-react';
import './App.css';

function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="clock">{hours}:{minutes}</span>
      </div>
      <div className="status-center">
        <Battery size={20} fill={theme.colors.iconActive} stroke={theme.colors.iconActive} />
        <span className="battery-text">87%</span>
      </div>
      <div className="status-right">
        <Wifi size={18} fill={theme.colors.iconActive} stroke={theme.colors.iconActive} />
        <span className="wifi-text">Good</span>
      </div>
    </div>
  );
}

function DetailPanel({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="detail-panel-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-icon">
          <item.icon size={64} />
        </div>
        <h2 className="detail-title">{item.label}</h2>
        {item.action?.description && (
          <p className="detail-description">{item.action.description}</p>
        )}
        {item.action?.date && (
          <p className="detail-date">{item.action.date}</p>
        )}
      </div>
    </div>
  );
}

function MediaPlayer({ item, onClose }) {
  if (!item) return null;

  const renderContent = () => {
    switch (item.action.contentType) {
      case 'video':
        return (
          <video controls autoPlay style={{ width: '100%', maxHeight: '70vh' }}>
            <source src={item.action.src} type="video/mp4" />
          </video>
        );
      case 'audio':
        return (
          <div className="audio-player">
            <item.icon size={80} />
            <p className="audio-title">{item.label}</p>
            <audio controls autoPlay style={{ width: '80%' }}>
              <source src={item.action.src} type="audio/mp3" />
            </audio>
          </div>
        );
      case 'webgl':
      case 'web':
        return (
          <iframe
            src={item.action.src}
            title={item.label}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="fullscreen"
          />
        );
      default:
        return <p>Unsupported media type</p>;
    }
  };

  return (
    <div className="media-player-overlay">
      <div className="media-player">
        <button className="media-close" onClick={onClose}>
          <span>✕</span>
        </button>
        <h3 className="media-title">{item.label}</h3>
        <div className="media-content">{renderContent()}</div>
      </div>
    </div>
  );
}

function App() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [showMedia, setShowMedia] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [menuOffset, setMenuOffset] = useState({ x: 0, y: 0 });

  const currentItems = categories[currentCategory]?.items || [];
  const columnsPerRow = 5;

  const updateMenuOffset = useCallback((newCategory, newIndex) => {
    const newOffsetX = -newCategory * 100;
    const newOffsetY = -newIndex * 76;
    setMenuOffset({ x: newOffsetX, y: newOffsetY });
  }, []);

  const handleCategoryChange = useCallback((index) => {
    if (index >= 0 && index < categories.length) {
      setCurrentCategory(index);
      setSelectedIndex(0);
      updateMenuOffset(index, 0);
    }
  }, [updateMenuOffset]);

  const handleItemSelect = useCallback((index) => {
    if (index >= 0 && index < currentItems.length) {
      setSelectedIndex(index);
      updateMenuOffset(currentCategory, index);
    }
  }, [currentCategory, currentItems.length, updateMenuOffset]);

  const handleActivate = useCallback((index) => {
    const item = currentItems[index];
    if (!item) return;

    setActiveItem(item);
    
    if (item.action?.type === 'media') {
      setShowMedia(item);
    } else {
      setShowDetails(true);
    }
  }, [currentItems]);

  const handleBack = useCallback(() => {
    setShowDetails(false);
    setShowMedia(null);
    setActiveItem(null);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (showMedia || showDetails) {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        handleBack();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (currentCategory > 0) {
          handleCategoryChange(currentCategory - 1);
        }
        break;
      case 'ArrowRight':
        if (currentCategory < categories.length - 1) {
          handleCategoryChange(currentCategory + 1);
        }
        break;
      case 'ArrowUp':
        if (selectedIndex > 0) {
          handleItemSelect(selectedIndex - 1);
        }
        break;
      case 'ArrowDown':
        if (selectedIndex < currentItems.length - 1) {
          handleItemSelect(selectedIndex + 1);
        }
        break;
      case 'Enter':
        if (currentItems[selectedIndex]) {
          handleActivate(selectedIndex);
        }
        break;
      default:
        break;
    }
  }, [currentCategory, selectedIndex, currentItems, showMedia, showDetails, handleCategoryChange, handleItemSelect, handleActivate, handleBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    updateMenuOffset(currentCategory, selectedIndex);
  }, []);

  return (
    <div className="app">
      <StatusBar />
      
      <div className="xmb-container">
        <div className="menu-layer" style={{ transform: `translate(${menuOffset.x}vw, ${menuOffset.y}px)` }}>
          {categories.map((cat, catIndex) => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="category-column" data-category-index={catIndex}>
                <div className={`category-icon ${currentCategory === catIndex ? 'active' : ''}`}>
                  <CatIcon size={48} />
                </div>
                
                <div className="items-column">
                  {cat.items.map((item, itemIndex) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        className={`item-icon ${currentCategory === catIndex && selectedIndex === itemIndex ? 'selected' : ''}`}
                        onClick={() => {
                          handleCategoryChange(catIndex);
                          handleItemSelect(itemIndex);
                        }}
                        onDoubleClick={() => {
                          handleCategoryChange(catIndex);
                          handleItemSelect(itemIndex);
                          handleActivate(itemIndex);
                        }}
                      >
                        <div className="item-icon-wrapper">
                          <ItemIcon size={32} />
                        </div>
                        <span className="item-label">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reticle">
          <div className="reticle-corner reticle-tl"></div>
          <div className="reticle-corner reticle-tr"></div>
          <div className="reticle-corner reticle-bl"></div>
          <div className="reticle-corner reticle-br"></div>
        </div>
      </div>

      {showDetails && activeItem && (
        <DetailPanel item={activeItem} onClose={handleBack} />
      )}

      {showMedia && (
        <MediaPlayer item={showMedia} onClose={handleBack} />
      )}
    </div>
  );
}

export default App;
