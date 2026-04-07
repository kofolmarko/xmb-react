import { SubMenuPanel } from './SubMenuPanel';

export function ItemRow({ item, index, isSelected, isSubOpen, subMenuIndex, selectedIndex, onNavigateItem, onActivate, onBack, isGameCategory, isItemAboveSelected }) {
  const ItemIcon = item.icon;
  const hasSubItems = !!item.subItems?.length;
  const hasThumbnail = !!item.thumbnail;

  return (
    <div
      className={`item-row ${isSelected ? 'selected' : ''}`}
      style={isItemAboveSelected ? { marginBottom: 'calc(var(--category-height) + 12px)' } : undefined}
    >
      <button
        className={`item-icon ${isSelected ? 'selected' : ''} ${hasThumbnail ? 'has-thumbnail' : ''}`}
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
        {hasThumbnail ? (
          <div className="item-thumbnail-wrapper">
            <img src={item.thumbnail} alt={item.label} className="item-thumbnail" />
          </div>
        ) : (
          <div className="item-icon-wrapper">
            <ItemIcon size={24} />
          </div>
        )}
        <span className="item-label">{item.label}</span>
        {hasSubItems && <span className="item-sub-arrow">►</span>}
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
