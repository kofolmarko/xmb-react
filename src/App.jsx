import { useState, useEffect, useCallback, useRef } from 'react';
import { theme, categories } from './manifest';
import { Battery, Wifi, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

function CategoryBar({ currentCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-bar-container">
      <button className="category-scroll category-scroll-left" onClick={() => scroll(-1)}>
        <ChevronLeft size={20} />
      </button>
      <div className="category-bar" ref={scrollRef}>
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              className={`category-item ${currentCategory === index ? 'active' : ''}`}
              onClick={() => onCategoryChange(index)}
            >
              <Icon size={28} />
              <span className="category-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
      <button className="category-scroll category-scroll-right" onClick={() => scroll(1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function IconGrid({ items, selectedIndex, onSelect, onActivate }) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current) {
      const selected = gridRef.current.querySelector('.icon-item.selected');
      if (selected) {
        selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!items || items.length === 0) {
    return <div className="empty-message">No items</div>;
  }

  return (
    <div className="icon-grid" ref={gridRef}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`icon-item ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => onActivate(index)}
            onFocus={() => onSelect(index)}
          >
            <div className="icon-wrapper">
              <Icon size={36} />
            </div>
            <span className="icon-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DetailPanel({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="detail-panel-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>
          <X size={24} />
        </button>
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
        {item.action?.type === 'media' && item.action.contentType !== 'webgl' && (
          <div className="detail-action-hint">Press Enter to play</div>
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
          <X size={28} />
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

  const currentItems = categories[currentCategory]?.items || [];

  const handleCategoryChange = useCallback((index) => {
    setCurrentCategory(index);
    setSelectedIndex(0);
  }, []);

  const handleIconSelect = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleIconActivate = useCallback((index) => {
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
        if (selectedIndex >= 5) {
          setSelectedIndex(selectedIndex - 5);
        }
        break;
      case 'ArrowDown':
        if (selectedIndex + 5 < currentItems.length) {
          setSelectedIndex(selectedIndex + 5);
        }
        break;
      case 'Enter':
        if (currentItems[selectedIndex]) {
          handleIconActivate(selectedIndex);
        }
        break;
      default:
        break;
    }
  }, [currentCategory, selectedIndex, currentItems, showMedia, showDetails, handleCategoryChange, handleIconActivate, handleBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [currentCategory]);

  return (
    <div className="app">
      <StatusBar />
      
      <div className="main-content">
        <div className="category-label-container">
          <span className="category-label-text">
            {categories[currentCategory]?.label}
          </span>
        </div>
        
        <IconGrid
          items={currentItems}
          selectedIndex={selectedIndex}
          onSelect={handleIconSelect}
          onActivate={handleIconActivate}
        />
      </div>

      <CategoryBar
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

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
