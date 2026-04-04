import { SubMenuPanel } from './SubMenuPanel';

export function ItemRow({ item, index, isSelected, isSubOpen, subMenuIndex, onSelect, onActivate, isGameCategory, isItemAboveSelected }) {
  const ItemIcon = item.icon;
  const hasSubItems = !!item.subItems?.length;

  return (
    <div
      className={`item-row ${isSelected ? 'selected' : ''}`}
      style={isItemAboveSelected ? { marginBottom: 'calc(var(--category-height) + 12px)' } : undefined}
    >
      <button
        className={`item-icon ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          if (!isSelected) onSelect(index);
          else onActivate();
        }}
      >
        <div className="item-icon-wrapper">
          <ItemIcon size={24} />
        </div>
        <span className="item-label">{item.label}</span>
        {isGameCategory && item.umd && isSelected && (
          <span className="umd-indicator">UMD</span>
        )}
      </button>

      {isSelected && isSubOpen && (
        <span className="sub-open-arrow">►</span>
      )}

      {isSelected && hasSubItems && isSubOpen && (
        <SubMenuPanel
          subItems={item.subItems}
          subMenuIndex={subMenuIndex}
          onActivate={onActivate}
        />
      )}
    </div>
  );
}
