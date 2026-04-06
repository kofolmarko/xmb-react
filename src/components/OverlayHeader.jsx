import '../styles/OverlayHeader.css';

export function OverlayHeader({ icon: Icon, title }) {
  return (
    <div className="overlay-header">
      {Icon && <Icon size={16} />}
      <span>{title}</span>
    </div>
  );
}
