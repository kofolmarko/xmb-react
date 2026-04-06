import { useMemo } from 'react';
import { useXMB } from '../context/XMBContext';
import { categories } from '../manifest';
import '../styles/CategoryRow.css';

const CATEGORY_WIDTH = 110;

export function CategoryRow({ currentCategory, subMenuOpen }) {
  const { navigateToCategory } = useXMB();

  const style = useMemo(() => {
    const categoryOffset = -currentCategory * CATEGORY_WIDTH;
    const shiftOffset = subMenuOpen ? -100 : 0;
    const totalOffset = categoryOffset + shiftOffset;
    return {
      left: 'var(--item-left)',
      transform: `translateX(${totalOffset}px)`,
      opacity: subMenuOpen ? 0.2 : 1,
      transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  }, [currentCategory, subMenuOpen]);

  return (
    <div className="category-row">
      <div className={`category-inner ${subMenuOpen ? 'sub-open' : ''}`} style={style}>
        {categories.map((cat, index) => {
          const CatIcon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`category-col ${currentCategory === index ? 'active' : ''}`}
              onClick={() => navigateToCategory(index)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">
                <CatIcon size={40} />
              </div>
              <span className="category-label">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
