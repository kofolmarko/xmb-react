import { useMemo } from 'react';
import { categories } from '../manifest';
import { ItemRow } from './ItemRow';
import '../styles/ItemColumn.css';

export function ItemColumn({ currentCategory, selectedIndices, subMenuOpen, subMenuIndex, isSwitchingCategory, onNavigateItem, onActivate, onBack }) {
  const items = useMemo(() => categories[currentCategory]?.items || [], [currentCategory]);
  const cat = useMemo(() => categories[currentCategory], [currentCategory]);
  const selectedIndex = selectedIndices[currentCategory];
  const isGameCategory = cat?.id === 'game';

  const style = useMemo(() => {
    const yOffset = `calc(var(--selected-index) * -1 * (var(--item-height) + var(--item-gap)) - ${selectedIndex > 0 ? 'calc(var(--category-height) + 12px)' : '0px'})`;
    const xOffset = subMenuOpen ? '-100px' : '0px';
    return {
      left: 'var(--item-left)',
      '--selected-index': selectedIndex,
      transform: `translateX(${xOffset}) translateY(${yOffset})`,
      transition: isSwitchingCategory ? 'none' : 'transform 100ms cubic-bezier(0.33, 0.66, 0.66, 1)',
    };
  }, [selectedIndex, isSwitchingCategory, subMenuOpen]);

  return (
    <div className="items-row">
      <div
        className={`items-inner ${subMenuOpen ? 'sub-open' : ''}`}
        style={style}
      >
        {items.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            index={index}
            isSelected={selectedIndex === index}
            isSubOpen={subMenuOpen}
            subMenuIndex={subMenuIndex}
            selectedIndex={selectedIndex}
            onNavigateItem={onNavigateItem}
            onActivate={onActivate}
            onBack={onBack}
            isGameCategory={isGameCategory}
            isItemAboveSelected={index === selectedIndex - 1}
          />
        ))}
      </div>
    </div>
  );
}
