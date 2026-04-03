import { SubMenuPanel } from './SubMenuPanel';

export function ItemRow({ item, index, isSelected, isSubOpen, subMenuIndex, onSelect, onActivate }) {
  const ItemIcon = item.icon;
  const hasSubItems = !!item.subItems?.length;

  return (
    <div
      className={`item-row ${isSelected ? 'selected' : ''}`}
      style={isSelected && index > 0 ? { marginTop: `${72}px` } : undefined}
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
