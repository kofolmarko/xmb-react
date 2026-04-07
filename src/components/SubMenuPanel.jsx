import '../styles/SubMenu.css';

export function SubMenuPanel({ subItems, subMenuIndex, onNavigateItem, onActivate }) {
  const anyHasThumbnail = subItems.some(s => !!s.thumbnail);
  return (
    <div className="sub-menu-panel">
      {subItems.map((sub, si) => {
        const SubIcon = sub.icon;
        const hasThumbnail = !!sub.thumbnail;
        const iconInThumbList = anyHasThumbnail && !hasThumbnail;
        const itemStyle = {
          transform: `translateY(calc(${subMenuIndex} * -1 * (var(--item-height) + var(--item-gap))))`,
          transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        };
        return (
          <button
            key={sub.id}
            className={`sub-item ${subMenuIndex === si ? 'selected' : ''} ${hasThumbnail ? 'has-thumbnail' : ''} ${iconInThumbList ? 'icon-in-thumb-list' : ''}`}
            style={itemStyle}
            onClick={() => {
              if (subMenuIndex === si) {
                onActivate();
              } else {
                const direction = si - subMenuIndex;
                onNavigateItem(direction);
              }
            }}
          >
            {hasThumbnail ? (
              <div className="sub-item-thumb-wrapper">
                <img src={sub.thumbnail} alt={sub.label} className="sub-item-thumb" />
              </div>
            ) : (
              <div className="sub-item-icon">
                <SubIcon size={24} />
              </div>
            )}
            <span className="sub-item-label">{sub.label}</span>
          </button>
        );
      })}
    </div>
  );
}
