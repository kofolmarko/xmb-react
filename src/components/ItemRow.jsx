import { SubMenuPanel } from './SubMenuPanel';

export function ItemRow({ item, index, isSelected, isSubOpen, subMenuIndex, selectedIndex, onNavigateItem, onActivate, onBack, isGameCategory, isItemAboveSelected }) {
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
          if (!isSelected) {
            const direction = index - selectedIndex;
            onNavigateItem(direction);
          } else if (isSubOpen && hasSubItems) {
            // If submenu is open, clicking parent item closes it
            onBack();
          } else {
            onActivate();
          }
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
          onNavigateItem={onNavigateItem}
          onActivate={onActivate}
        />
      )}
    </div>
  );
}
