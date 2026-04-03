import '../styles/SubMenu.css';

export function SubMenuPanel({ subItems, subMenuIndex, onActivate }) {
  return (
    <div className="sub-menu-panel">
      {subItems.map((sub, si) => {
        const SubIcon = sub.icon;
        return (
          <button
            key={sub.id}
            className={`sub-item ${subMenuIndex === si ? 'selected' : ''}`}
            onClick={() => {
              if (subMenuIndex === si) onActivate();
            }}
          >
            <div className="sub-item-icon">
              <SubIcon size={16} />
            </div>
            <span className="sub-item-label">{sub.label}</span>
          </button>
        );
      })}
    </div>
  );
}
