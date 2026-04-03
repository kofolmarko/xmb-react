import { useMemo } from 'react';
import { categories } from '../manifest';
import '../styles/CategoryRow.css';

const CATEGORY_WIDTH = 100;

export function CategoryRow({ currentCategory }) {
  const style = useMemo(() => ({
    left: '20%',
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
                <CatIcon size={32} />
              </div>
              <span className="category-label">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
