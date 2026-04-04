import '../styles/SubMenu.css';

export function SubMenuPanel({ subItems, subMenuIndex, onActivate }) {
  return (
    <div className="sub-menu-panel">
      {subItems.map((sub, si) => {
        const SubIcon = sub.icon;
        const itemStyle = {
          transform: `translateY(calc(${subMenuIndex} * -1 * (var(--item-height) + var(--item-gap))))`,
          transition: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        };
        return (
          <button
            key={sub.id}
            className={`sub-item ${subMenuIndex === si ? 'selected' : ''}`}
            style={itemStyle}
            onClick={() => {
              if (subMenuIndex === si) onActivate();
            }}
          >
            <div className="sub-item-icon">
              <SubIcon size={24} />
            </div>
            <span className="sub-item-label">{sub.label}</span>
          </button>
        );
      })}
    </div>
  );
}
