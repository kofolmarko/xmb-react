import { useMemo } from 'react';
import { categories } from '../manifest';
import '../styles/CategoryRow.css';

const CATEGORY_WIDTH = 110;

export function CategoryRow({ currentCategory }) {
  const style = useMemo(() => ({
    left: 'var(--item-left)',
    transform: `translateX(-${currentCategory * CATEGORY_WIDTH}px)`
  }), [currentCategory]);

  return (
    <div className="category-row">
      <div className="category-inner" style={style}>
        {categories.map((cat, index) => {
          const CatIcon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`category-col ${currentCategory === index ? 'active' : ''}`}
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
