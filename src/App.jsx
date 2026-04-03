import { useState, useEffect, useCallback } from 'react';
import { theme, categories } from './manifest';
import { Battery, Wifi } from 'lucide-react';
import './App.css';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = DAYS[time.getDay()];
  const date = time.getDate();
  const month = MONTHS[time.getMonth()];
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = (hours % 12 || 12).toString().padStart(2, '0');

  return (
    <div className="status-bar">
      <span className="status-date">{day}, {date} {month} {h12}:{minutes}:{seconds} {ampm}</span>
      <span className="status-battery">
        <Battery size={14} fill="currentColor" stroke="currentColor" />
        87%
      </span>
      <Wifi size={14} fill="currentColor" stroke="currentColor" />
    </div>
  );
}

function SplashBackground({ splashArt }) {
  return (
    <div
      className={`splash-bg ${splashArt ? 'visible' : ''}`}
      style={splashArt ? { backgroundImage: `url(${splashArt})` } : undefined}
    />
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

const CATEGORY_WIDTH = 100;
const ITEM_HEIGHT = 52;
const CATEGORY_HEIGHT = 72;

function App() {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState(() => categories.map(cat => cat.defaultIndex ?? 0));
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [showMedia, setShowMedia] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Sub-menu state
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [subMenuIndex, setSubMenuIndex] = useState(0);

  const selectedIndex = selectedIndices[currentCategory];
  const currentItems = categories[currentCategory]?.items || [];
  const focusedItem = currentItems[selectedIndex];

  const handleCategoryChange = useCallback((direction) => {
    setSubMenuOpen(false);
    setIsSwitchingCategory(true);
    setCurrentCategory(prev => {
      const next = prev + direction;
      if (next < 0) return categories.length - 1;
      if (next >= categories.length) return 0;
      return next;
    });
  }, []);

  const handleItemSelect = useCallback((direction) => {
    if (subMenuOpen) {
      const subItems = focusedItem?.subItems || [];
      setSubMenuIndex(prev => {
        const next = prev + direction;
        if (next < 0) return subItems.length - 1;
        if (next >= subItems.length) return 0;
        return next;
      });
      return;
    }
    setIsSwitchingCategory(false);
    setSelectedIndices(prev => {
      const next = prev[currentCategory] + direction;
      const len = categories[currentCategory].items.length;
      const clamped = next < 0 ? len - 1 : next >= len ? 0 : next;
      const updated = [...prev];
      updated[currentCategory] = clamped;
      return updated;
    });
  }, [currentCategory, subMenuOpen, focusedItem]);

  const handleActivate = useCallback(() => {
    if (subMenuOpen) {
      const subItem = focusedItem?.subItems?.[subMenuIndex];
      if (!subItem) return;
      setActiveItem(subItem);
      if (subItem.action?.type === 'media') {
        setShowMedia(subItem);
      } else {
        setShowDetails(true);
      }
      return;
    }

    const item = currentItems[selectedIndex];
    if (!item) return;

    if (item.subItems?.length) {
      setSubMenuOpen(true);
      setSubMenuIndex(0);
      return;
    }

    setActiveItem(item);
    if (item.action?.type === 'media') {
      setShowMedia(item);
    } else {
      setShowDetails(true);
    }
  }, [currentItems, selectedIndex, subMenuOpen, focusedItem, subMenuIndex]);

  const handleBack = useCallback(() => {
    if (showDetails || showMedia) {
      setShowDetails(false);
      setShowMedia(null);
      setActiveItem(null);
      return;
    }
    if (subMenuOpen) {
      setSubMenuOpen(false);
    }
  }, [showDetails, showMedia, subMenuOpen]);

  const handleKeyDown = useCallback((e) => {
    if (showMedia || showDetails) {
      if (e.key === 'Escape' || e.key === 'Backspace') handleBack();
      return;
    }
    switch (e.key) {
      case 'ArrowLeft':  handleCategoryChange(-1); break;
      case 'ArrowRight': handleCategoryChange(1);  break;
      case 'ArrowUp':    handleItemSelect(-1);      break;
      case 'ArrowDown':  handleItemSelect(1);       break;
      case 'Enter':      handleActivate();          break;
      case 'Escape':
      case 'Backspace':  handleBack();              break;
      default: break;
    }
  }, [showMedia, showDetails, handleCategoryChange, handleItemSelect, handleActivate, handleBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close sub-menu when item changes
  useEffect(() => {
    setSubMenuOpen(false);
  }, [selectedIndex, currentCategory]);

  const splashArt = focusedItem?.splashArt ?? null;

  return (
    <div className="app">
      <SplashBackground splashArt={splashArt} />
      <StatusBar />

      <div className="xmb-container">
        {/* Category Row */}
        <div className="category-row">
          <div
            className="category-inner"
            style={{
              left: '20%',
              transform: `translateX(-${currentCategory * CATEGORY_WIDTH}px)`
            }}
          >
            {categories.map((cat, index) => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className={`category-col ${currentCategory === index ? 'active' : ''}`}
                >
                  <div className="category-icon">
                    <CatIcon size={32} />
                  </div>
                  <span className="category-label">{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Column */}
        <div className="items-row">
          <div
            className={`items-inner ${subMenuOpen ? 'sub-open' : ''}`}
            style={{
              left: '20%',
              transform: `translateY(-${selectedIndex * ITEM_HEIGHT + (selectedIndex > 0 ? CATEGORY_HEIGHT : 0)}px)`,
              transition: isSwitchingCategory ? 'none' : undefined,
            }}
          >
            {currentItems.map((item, index) => {
              const ItemIcon = item.icon;
              const isSelected = selectedIndex === index;
              const hasSubItems = !!item.subItems?.length;

              return (
                <div
                  key={item.id}
                  className={`item-row ${isSelected ? 'selected' : ''}`}
                  style={isSelected && index > 0 ? { marginTop: `${CATEGORY_HEIGHT}px` } : undefined}
                >
                  <button
                    className={`item-icon ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      if (!isSelected) {
                        setSelectedIndices(prev => {
                          const updated = [...prev];
                          updated[currentCategory] = index;
                          return updated;
                        });
                      } else {
                        handleActivate();
                      }
                    }}
                  >
                    <div className="item-icon-wrapper">
                      <ItemIcon size={24} />
                    </div>
                    <span className="item-label">{item.label}</span>
                  </button>

                  {/* Arrow between item and sub-menu */}
                  {isSelected && subMenuOpen && (
                    <span className="sub-open-arrow">►</span>
                  )}

                  {/* Sub-menu panel — appears to the right of the item */}
                  {isSelected && hasSubItems && subMenuOpen && (
                    <div className="sub-menu-panel">
                      {item.subItems.map((sub, si) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            className={`sub-item ${subMenuIndex === si ? 'selected' : ''}`}
                            onClick={() => {
                              setSubMenuIndex(si);
                              if (subMenuIndex === si) {
                                setActiveItem(sub);
                                if (sub.action?.type === 'media') setShowMedia(sub);
                                else setShowDetails(true);
                              }
                            }}
                          >
                            <div className="sub-item-icon">
                              <SubIcon size={16} />
                            </div>
                            <span className="sub-item-label">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
