import { useMemo } from 'react';
import { categories } from '../manifest';
import { ItemRow } from './ItemRow';
import '../styles/ItemColumn.css';

const ITEM_HEIGHT = 52;
const CATEGORY_HEIGHT = 72;

export function ItemColumn({ currentCategory, selectedIndices, subMenuOpen, subMenuIndex, isSwitchingCategory, onSelect, onActivate }) {
  const items = useMemo(() => categories[currentCategory]?.items || [], [currentCategory]);
  const selectedIndex = selectedIndices[currentCategory];

  const style = useMemo(() => ({
    left: '20%',
    transform: `translateY(-${selectedIndex * ITEM_HEIGHT + (selectedIndex > 0 ? CATEGORY_HEIGHT : 0)}px)`,
    transition: isSwitchingCategory ? 'none' : 'transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }), [selectedIndex, isSwitchingCategory]);

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
            onSelect={onSelect}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}
